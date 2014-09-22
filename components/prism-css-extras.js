Prism.languages.css.selector = {
	pattern: /[^\{\}\s][^\{\}]*(?=\s*\{)/g,
	inside: {
		'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/g,
		'pseudo-class': /:[-\w]+(?:\(.*\))?/g,
		'class': /\.[-:\.\w]+/g,
		'id': /#[-:\.\w]+/g,
		'punctuation': /[,\[\]=~\|\^\$\*]/g,
		'string': /("|')(\\?.)*?\1/g
	}
};

Prism.languages.insertBefore('css', 'important', {
    'value': {
        pattern: /[^!]\b[^:;]+?(?=(?:)?\s*;)/ig,
        inside: {
            'important': /\B!important\b/gi
        }
    }
});

delete Prism.languages.css.important;