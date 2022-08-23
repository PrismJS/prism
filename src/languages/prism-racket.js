import scheme from './prism-scheme.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'racket',
	require: scheme,
	alias: 'rkt',
	grammar({ extend, getLanguage }) {
		Prism.languages.racket = extend('scheme', {
			'lambda-parameter': {
				// the racket lambda syntax is a lot more complex, so we won't even attempt to capture it.
				// this will just prevent false positives of the `function` pattern
				pattern: /([(\[]lambda\s+[(\[])[^()\[\]'\s]+/,
				lookbehind: true
			}
		});

		Prism.languages.insertBefore('racket', 'string', {
			'lang': {
				pattern: /^#lang.+/m,
				greedy: true,
				alias: 'keyword'
			}
		});
	}
});
