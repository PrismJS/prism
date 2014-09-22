Prism.languages.jsonp = Prism.languages.extend('json',{
    'function': {
		pattern: /[a-z0-9_]+\(/ig,
		inside: {
			punctuation: /\(/
		}
	},
    'punctuation': /[{}[\]);,]/g,
});