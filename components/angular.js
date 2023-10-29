(function (Prism) {
	Prism.languages.angular = Prism.languages.extend('markup', {
		'keyword': /(?:@if|@for|@switch|@defer|@loading|@error|@placeholder|prefetch)\b/,
		'operator': /\b(?:on|when)\b/,
		'number': {
			pattern: /\b(after|minimum)\s+\d+(?:ms|s)?/gi,
			lookbehind: true,
		},
		'builtin': { pattern: /\b(?:after|hover|idle|immediate|interaction|minimum|timer|viewport)/ },
		'function':
      /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
	});

	Prism.languages.ng = Prism.languages.angular;
}(Prism));
