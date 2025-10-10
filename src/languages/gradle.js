import clike from './clike.js';

/** @type {import('../types.d.ts').LanguageProto<'gradle'>} */
export default {
	id: 'gradle',
	base: clike,
	grammar () {
		const interpolation = {
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

		return {
			'string': {
				pattern: /'''(?:[^\\]|\\[\s\S])*?'''|'(?:\\.|[^\\'\r\n])*'/,
				greedy: true,
			},
			'keyword':
				/\b(?:apply|def|dependencies|else|if|implementation|import|plugin|plugins|project|repositories|repository|sourceSets|tasks|val)\b/,
			'number':
				/\b(?:0b[01_]+|0x[\da-f_]+(?:\.[\da-f_p\-]+)?|[\d_]+(?:\.[\d_]+)?(?:e[+-]?\d+)?)[glidf]?\b/i,
			'operator': {
				pattern:
					/(^|[^.])(?:~|==?~?|\?[.:]?|\*(?:[.=]|\*=?)?|\.[@&]|\.\.<|\.\.(?!\.)|-[-=>]?|\+[+=]?|!=?|<(?:<=?|=>?)?|>(?:>>?=?|=)?|&[&=]?|\|[|=]?|\/=?|\^=?|%=?)/,
				lookbehind: true,
			},
			'punctuation': /\.+|[{}[\];(),:$]/,
			$insert: {
				'shebang': {
					$before: 'string',
					pattern: /#!.+/,
					alias: 'comment',
					greedy: true,
				},
				'interpolation-string': {
					$before: 'string',
					pattern:
						/"""(?:[^\\]|\\[\s\S])*?"""|(["/])(?:\\.|(?!\1)[^\\\r\n])*\1|\$\/(?:[^/$]|\$(?:[/$]|(?![/$]))|\/(?!\$))*\/\$/,
					greedy: true,
					inside: {
						'interpolation': interpolation,
						'string': /[\s\S]+/,
					},
				},
				'spock-block': {
					$before: 'punctuation',
					pattern: /\b(?:and|cleanup|expect|given|setup|then|when|where):/,
				},
				'annotation': {
					$before: 'function',
					pattern: /(^|[^.])@\w+/,
					lookbehind: true,
					alias: 'punctuation',
				},
			},
		};
	},
};
