(function (Prism) {    
    Prism.languages.dataweave = {	
        'url': {
            pattern:/\b[A-Za-z]+:\/\/[\w/:.?=&-]+|\burn:[\w:.?=&-]+/
        },
        'property': {
            pattern: /(?:[A-Za-z0-9_]+#)?(?:"(?:\\.|[^\\"\r\n])*"|[A-Za-z0-9_]+)(?=\s*[:@])/,
            greedy: true
        },
        'string': {
            pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/,
            greedy: true
        },
        'mime-type': {
            pattern: /(?:text|audio|video|application|multipart|image)\/(?:[A-Za-z-_+0-9])+/
        },       
        'date': {
            pattern: /\|[^ ](?:[^\\|\r\n]|\\[^\r\n])+\|/,
            greedy: true
        },
        'comment': [
            {
                pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
                lookbehind: true,
                greedy: true
            },
            {
                pattern: /(^|[^\\:])\/\/.*/,
                lookbehind: true,
                greedy: true
            }
        ],
        'regex': {
            pattern: /\/[^ ](?:[^\\\/\r\n]|\\[^\r\n])+\//,
            greedy: true
        },
        'function': /\b[A-Za-z_]\w*(?=\s*\()/i,
        'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
        'punctuation': /[{}[\];(),.:@]/,        
        'operator': /<<|>>|->|[<>~=]=?|!=|--?-?|\+\+?|\!|\?/,
        'boolean': /\b(?:true|false)\b/,
        'keyword': {
            pattern: /\b(?:match|input|output|ns|type|update|null|if|else|using|unless|at|is|as|case|do|fun|var|not|and|or)\b/
        }
    };
    
}(Prism));
