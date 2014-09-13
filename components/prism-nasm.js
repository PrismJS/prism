Prism.languages.nasm = {
    'comment': /;.*$/m,
    'string': /("|'|`)(\\?.)*?\1/gm,
    'label': {
        pattern: /^\s*[A-Za-z\._\?\$][\w\.\?\$@~#]*:/m,
        alias: 'function'
    },
    'keyword': [
        /\[?BITS (16|32|64)\]?/m,
        /DEFAULT.*$/m,
        /^\s*section\s*[a-zA-Z\.]+:?/im,
        /extern[^;]*/im,
        /global[^;]*/im,
        /CPU.*$/m,
        /FLOAT.*$/m
    ],
    'register': {
        pattern: /(\W)([er]?[abcd]x|[abcd][hl]|[er]?(bp|sp|si|di)|[cdefgs]s)/g,
        alias: 'variable',
	lookbehind: true
    },
    'constant': [
        {
            pattern: /(\W)\d+/g,
            lookbehind: true
        },
        {
            pattern: /(\W)0x[a-fA-F0-9]+/g,
            lookbehind: true
        },
        {
            pattern: /(\W)[a-fA-F0-9]+h/g,
            lookbehind: true
        },
        {
            pattern: /(\W)\d+\.\d*/g,
            lookbehind: true
        },
        {
            pattern: /(\W)[01]+b/g,
            lookbehind: true
        },
    ],
    'operator': /[\[\]\*+\-]/gm
};
