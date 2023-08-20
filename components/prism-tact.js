(function(Prism) {
  Prism.languages.tact = {
    // reserved keywords
    'keyword': [
      {
        pattern: /\b(?:abstract|as|const|contract(?!:)|do|else|extend|extends|fun|get|if|import|initOf|inline|let|message(?!:)|mutates|native|override|primitive|public|repeat|return|self|struct(?!:)|trait(?!:)|until|virtual|while|with)\b/,
      },
      { // keyword after as
        pattern: /(\bas\s+)\w+/,
        lookbehind: true,
        greedy: true,
      },
      { // reserved function names
        pattern: /\b(?:init|receive|bounced|external)\b/
      },
    ],

    // built-in types
    'builtin': {
      pattern: /\b(?:Int|Bool|Address|Slice|Cell|Builder|String|StringBuilder)\b/,
    },

    // SCREAMING_SNAKE_CASE for null values and names of constants
    'constant': [
      {
        pattern: /\bnull\b/,
      },
      {
        pattern: /\b[A-Z][A-Z0-9_]*\b/,
      },
    ],

    // UpperCamelCase for names of contracts, traits, structs, messages
    'class-name': {
      pattern: /\b[A-Z][\w]*\b/,
    },

    // native FunC functions mapping
    'attribute': {
      pattern: /@name/,
      inside: {
        'function': /.+/,
      },
    },

    'function': {
      pattern: /\b[\w]+(?=\()/,
    },

    'boolean': {
      pattern: /\b(?:false|true)\b/,
    },

    'number': [
      { // hexadecimal, case-insensitive /i
        pattern: /\b0x[0-9a-f]+\b/i,
      },
      { // decimal integers
        pattern: /\b[0-9]+\b/,
      }
    ],

    'string': undefined,

    'punctuation': {
      pattern: /[{}[\]();,.:?]/,
    },

    'comment': [
      { // single-line
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true,
      },
      { // multi-line
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true,
        greedy: true,
      }
    ],

    'operator': {
      'pattern': /![!=]?|\*|\/|%|-|\+|==?|[<>]=?|<<|>>|\|\|?|&&?/,
    },

  };

  // strings, made this way to not collide with other entities
  Prism.languages.insertBefore('tact', 'string', {
    'string-literal': {
      pattern: /(?:(")(?:\\.|(?!\1)[^\\\r\n])*\1(?!\1))/,
      greedy: true,
      inside: {
        'string': {
          pattern: /[\s\S]+/,
        },
      },
    },
  });

  // map and bounced message generic type modifiers
  Prism.languages.insertBefore('tact', 'keyword', {
    'generics': {
      pattern: /(?:\b(?:map|bounced)\b<[^\\\r\n]*>)/,
      greedy: true,
      inside: {
        'builtin': [
          Prism.languages['tact']['builtin'],
          {
            pattern: /\b(?:map(?=<)|bounced(?=<))\b/
          },
        ],
        'class-name': Prism.languages['tact']['class-name'],
        'punctuation': {
          pattern: /[<>(),.?]/,
        },
        'keyword': [
          {
            pattern: /\bas\b/,
          },
          {
            pattern: /(\bas\s+)\w+/,
            lookbehind: true,
            greedy: true,
          },
        ],
      },
    },
  });
}(Prism));