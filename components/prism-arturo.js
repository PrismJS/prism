Prism.languages.arturo = {
    'comment': /;.*/,

    'character': {
        pattern: /`.`/,
        alias: 'function'
    },

    'string': {
        pattern: /"(?:[^"\\]|\\.)*"/,
        greedy: true,
        alias: 'function'
    }
};

Prism.languages.art = Prism.languages["arturo"];