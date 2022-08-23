import clike from './prism-clike.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'gradle',
	require: clike,
	grammar({ extend, getLanguage }) {
		let interpolation = {
			pattern: /((?:^|[^\\$])(?:\\{2})*)\$(?:\w+|\{[^{}]*\})/,
			lookbehind: true,
			inside: {
				'interpolation-punctuation': {
					pattern: /^\$\{?|\}$/,
					alias: 'punctuation',
				},
				'expression': {
					pattern: /[\s\S]+/,
					inside: 'gradle',
				},
			},
		};

		Prism.languages.gradle = extend('clike', {
			'string': {
				pattern: /'''(?:[^\\]|\\[\s\S])*?'''|'(?:\\.|[^\\'\r\n])*'/,
				greedy: true,
			},
			'keyword':
					/\b(?:apply|def|dependencies|else|if|implementation|import|plugin|plugins|project|repositories|repository|sourceSets|tasks|val)\b/,
			'number': /\b(?:0b[01_]+|0x[\da-f_]+(?:\.[\da-f_p\-]+)?|[\d_]+(?:\.[\d_]+)?(?:e[+-]?\d+)?)[glidf]?\b/i,
			'operator': {
				pattern:
						/(^|[^.])(?:~|==?~?|\?[.:]?|\*(?:[.=]|\*=?)?|\.[@&]|\.\.<|\.\.(?!\.)|-[-=>]?|\+[+=]?|!=?|<(?:<=?|=>?)?|>(?:>>?=?|=)?|&[&=]?|\|[|=]?|\/=?|\^=?|%=?)/,
				lookbehind: true,
			},
			'punctuation': /\.+|[{}[\];(),:$]/,
		});

		Prism.languages.insertBefore('gradle', 'string', {
			'shebang': {
				pattern: /#!.+/,
				alias: 'comment',
				greedy: true,
			},
			'interpolation-string': {
				pattern:
						/"""(?:[^\\]|\\[\s\S])*?"""|(["/])(?:\\.|(?!\1)[^\\\r\n])*\1|\$\/(?:[^/$]|\$(?:[/$]|(?![/$]))|\/(?!\$))*\/\$/,
				greedy: true,
				inside: {
					'interpolation': interpolation,
					'string': /[\s\S]+/,
				},
			},
		});

		Prism.languages.insertBefore('gradle', 'punctuation', {
			'spock-block': /\b(?:and|cleanup|expect|given|setup|then|when|where):/,
		});

		Prism.languages.insertBefore('gradle', 'function', {
			'annotation': {
				pattern: /(^|[^.])@\w+/,
				lookbehind: true,
				alias: 'punctuation',
			},
		});
	}
});