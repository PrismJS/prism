Prism.languages.ini= {
	'comment': /^\s*;.*$/gm,
	'important': /\[.*?\]/gm,
	'constant': /^\s*[^\W]+?(?=\=)/gm,
	'attr-value': {
		pattern: /\=.*/gm, 
		inside: {
			'punctuation': /[\=]/g
		}
	}
};