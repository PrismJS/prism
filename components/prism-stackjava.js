(function() {

// from MIN-MAX_CODE_POINT, Character.isJavaIdentifierStart(x) && !Character.isAlphabetic(x)
var JAVA_IDENTIFIERS = '$_¢£¤¥৲৳৻૱௹฿៛‿⁀⁔₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯₰₱₲₳₴₵₶₷₸₹꠸﷼︳︴﹍﹎﹏﹩＄＿￠￡￥￦؋';
var IDENTIFIER_CLS = '[' + JAVA_IDENTIFIERS + 'A-Za-z0-9]';

// $com _foo bar
var PKG_NAME_PATTERN = '(' + IDENTIFIER_CLS + '+)';
// com.foo.bar.baz
var PKG_PATH_PATTERN = '(\\b' + PKG_NAME_PATTERN + '(\\.' + PKG_NAME_PATTERN + ')+)';
// $Foo $9 _FOO Foo Bar9
var CLS_NAME_PATTERN = '(([' + JAVA_IDENTIFIERS + 'A-Z0-9])+' + IDENTIFIER_CLS + '*)';
// get getFoo get9Foos
var FN_NAME_PATTERN = '(_?[a-z]' + IDENTIFIER_CLS + '*|<(cl)?init>|-wrap\\d+)';
// com.foo.Bar$Baz
var PKG_CLS_PATTERN = '(' + PKG_PATH_PATTERN + ')?([.$]' + CLS_NAME_PATTERN + ')+';
// com.foo.Bar.baz(Bar.java:312)
var FN_CALL_PATTERN = IDENTIFIER_CLS + '+([.]' + IDENTIFIER_CLS +'+)*[.][-<]?' + IDENTIFIER_CLS + '+>?[(].*?[)]';

var createMethodCallDef = function() {
  return {
    'pattern': new RegExp(FN_CALL_PATTERN),
    'inside': {
      'class-method-args': {
        'pattern': new RegExp('([. ]?)'+IDENTIFIER_CLS+'+[.][-<]?'+IDENTIFIER_CLS+'+>?[(].*?[)]$'),
        'lookbehind': true,
        'inside': {
          'class-name': {
            'pattern': new RegExp('^' + IDENTIFIER_CLS + '+\\b'),
            'alias': 'entity',
          },
          'function': [
            {
              'pattern': new RegExp('([.])' + IDENTIFIER_CLS + '+\\b'),
              'lookbehind': true,
            },
            /<(cl)?init>/,
            /-wrap\d+/,
          ],
          'punctuation': [/[.()]/],
        },
      },
      'package': new RegExp(PKG_NAME_PATTERN),
      'punctuation': /[.]/,
    },
  };
};

var METHOD_CALL = createMethodCallDef();
var METHOD_CALL_FRAME = (function() {
  var def = createMethodCallDef();
  var fnCall = def.inside['class-method-args'];
  fnCall.inside = {
    'class-name': fnCall.inside['class-name'],
    'source': [
      {
        'pattern': /(\().*\.java(:\d+)?/,
        'lookbehind': true,
        'alias': 'entity',
        'inside': {
          'file': new RegExp('^' + IDENTIFIER_CLS + '+\\.java'),
          'lineno': {
            'pattern': /\d+/,
            'alias': 'number',
          },
          'punctuation': /[:]/,
        },
      },
      /Native Method/i,
      /Unknown Source/i,
      {
        'pattern': new RegExp('(\\(:)' + PKG_PATH_PATTERN),
        'lookbehind': true,
      },
    ],
    'function': fnCall.inside['function'],
    'punctuation': /[:.()]/,
  };
  return def;
}());

var JAVA_CLASS = {
  'pattern': new RegExp('\\b' + PKG_PATH_PATTERN + '\\b'),
  'inside': {
    'class-name': {
      'pattern': new RegExp('([.])' + IDENTIFIER_CLS + '+$'),
      'lookbehind': true,
      'alias': 'entity',
    },
    'package': {
      'pattern': new RegExp(PKG_NAME_PATTERN + '\\b'),
    },
    'punctuation': /[.]/,
  },
};

var PLAIN_PUNCTUATION = /[;:'"]/;

Prism.languages.stackjava = {
  'cause': {
    'pattern': /(\n)Caused by:.*/,
    'lookbehind': true,
    'inside': {
      'method-call': METHOD_CALL,
      'java-class': JAVA_CLASS,
      'keyword': /^(Caused by)/i,
      'punctuation': PLAIN_PUNCTUATION,
    },
  },
  'summary': {
    'pattern': new RegExp('(^|\n)' + PKG_PATH_PATTERN + '.*'),
    'lookbehind': true,
    'inside': {
      'method-call': METHOD_CALL,
      'java-class': JAVA_CLASS,
      'punctuation': PLAIN_PUNCTUATION,
    },
  },
  'stack-frame': {
    'pattern': new RegExp('(\\n\\s+)at ' + FN_CALL_PATTERN),
    'lookbehind': true,
    'inside': {
      'keyword': /\b(at)\b/,
      'method-call': METHOD_CALL_FRAME,
    },
  },
  'stack-truncation': {
    'pattern': /(\n\s+)\.\.\..*more/,
    'lookbehind': true,
    'inside': {
      'keyword': /\b(more)\b/,
      'punctuation': /\.\.\./,
      'count': {
        'pattern': /\d+/,
        'alias': 'number',
      },
    },
  },
};

}());
