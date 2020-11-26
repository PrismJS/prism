(function (Prism) {
    var keywords = /\b(?:match|input|output|ns|type|update|null|if|else|using|unless|at|is|as|case|do|fun|var|not|and|or)\b/;
    
    Prism.languages.dataweave = {	
        "url": {
            pattern:/(?:[A-z])+:\/\/(?:[A-z0-9/:\.\-_?=&])+|urn:(?:[A-z0-9:\-_\.?=&])+/
        },
        'property': {
            pattern: /(?:[A-z0-9_]+#)?(?:"(?:\\.|[^\\"\r\n])*"|(?:[A-z0-9_]+))(?=\s*(?::|@))/,
            greedy: true
        },
        'string': {
            pattern: /(["'`])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\])*\1/,
            greedy: true
        },
        "mime-type": {
            pattern: /(?:text|audio|video|application|multipart|image)\/(?:[A-z-_+0-9])+/
        },
        'regex': {
            pattern: /\/[^ ](?:[^\\\/\r\n]|\\[^\r\n])+\//,
            greedy: true
        },
        'date': {
            pattern: /\|[^ ](?:[^\\\|\r\n]|\\[^\r\n])+\|/,
            greedy: true
        },
        'comment': [
            {
                pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
                lookbehind: true
            },
            {
                pattern: /(^|[^\\:])\/\/.*/,
                lookbehind: true,
                greedy: true
            }
        ],
        'function': /[a-z_]\w*(?=\s*\()/i,
        'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
        'punctuation': /[{}[\];(),.:@]/,        
        'operator': /[<>~]=?|[!=]=?=?|--?|\+|\!/,
        'boolean': /\b(?:true|false)\b/,
        'keyword': {
            pattern: keywords
        }
    };
    
}(Prism));