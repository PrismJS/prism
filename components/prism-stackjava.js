(function() {

// from MIN-MAX_CODE_POINT, Character.isJavaIdentifierStart(x) && !Character.isAlphabetic(x)
var JAVA_IDENTIFIERS = '$_¢£¤¥৲৳৻૱௹฿៛‿⁀⁔₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯₰₱₲₳₴₵₶₷₸₹꠸﷼︳︴﹍﹎﹏﹩＄＿￠￡￥￦؋';
// $Foo $9 _FOO Foo Bar9
var CLS_NAME_PATTERN = '(([' + JAVA_IDENTIFIERS + 'A-Z0-9])+[' + JAVA_IDENTIFIERS + 'A-Za-z0-9]*)';
// get getFoo get9Foos
var FN_NAME_PATTERN = '(\\.[a-z]\\w*)';
// $com _foo bar
var PKG_NAME_PATTERN = '([' + JAVA_IDENTIFIERS + 'A-Za-z0-9])+';
// com.foo.bar.baz
var PKG_PATH_PATTERN = PKG_NAME_PATTERN + '(\\.' + PKG_NAME_PATTERN + ')+';
// com.foo.Bar$Baz
var PKG_CLS_PATTERN = PKG_PATH_PATTERN + '([.$]' + CLS_NAME_PATTERN + ')+';

Prism.languages.stackjava = {
  'lineno': {
    pattern: /(:)\d+/,
    lookbehind: true,
    alias: 'number'
  },
  'missing-frame-count': {
    pattern: /(... )\d+/,
    lookbehind: true,
    alias: 'number'
  },
  'file': [
    {
      pattern: /(\w+)\.java/,
      alias: 'entity'
    },
    /Unknown Source/,
    /Native Method/
  ],
  'function': [
    new RegExp(PKG_CLS_PATTERN + '\\.<(cl)?init>'), // com.Foo.<clinit>
    new RegExp(PKG_CLS_PATTERN + '\\.-wrap\\d+'),  // com.Foo.-wrap14
    new RegExp(PKG_CLS_PATTERN + FN_NAME_PATTERN),  // com.Foo.barBaz
    new RegExp(CLS_NAME_PATTERN + FN_NAME_PATTERN),  // Foo.barBaz
  ],
  'class-name': [
    {
    pattern: new RegExp(PKG_CLS_PATTERN),
    alias: 'entity'
  }
    ],
  'keyword': [
    /\n\s+at /,
    /(\nCaused by)/,
    /\n\t... /,
    / more$/
  ],
  'punctuation': [/[:()]/]
};

}());
