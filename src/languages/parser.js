import markup from './markup.js';

/** @type {import('../types.d.ts').LanguageProto<'parser'>} */
export default {
	id: 'parser',
	base: markup,
	grammar () {
		const punctuation = /[\[\](){};]/;

		const parser = {
			'expression': {
				// Allow for 3 levels of depth
				pattern: /(^|[^^])\((?:[^()]|\((?:[^()]|\((?:[^()])*\))*\))*\)/,
				greedy: true,
				lookbehind: true,
				inside: {}, // See below
			},
			'keyword': {
				pattern:
					/(^|[^^])(?:\^(?:case|eval|for|if|switch|throw)\b|@(?:BASE|CLASS|GET(?:_DEFAULT)?|OPTIONS|SET_DEFAULT|USE)\b)/,
				lookbehind: true,
			},
			'variable': {
				pattern: /(^|[^^])\B\$(?:\w+|(?=[.{]))(?:(?:\.|::?)\w+)*(?:\.|::?)?/,
				lookbehind: true,
				inside: {
					'punctuation': /\.|:+/,
				},
			},
			'function': {
				pattern: /(^|[^^])\B[@^]\w+(?:(?:\.|::?)\w+)*(?:\.|::?)?/,
				lookbehind: true,
				inside: {
					'keyword': {
						pattern: /(^@)(?:GET_|SET_)/,
						lookbehind: true,
					},
					'punctuation': /\.|:+/,
				},
			},
			'escape': {
				pattern: /\^(?:[$^;@()\[\]{}"':]|#[a-f\d]*)/i,
				alias: 'builtin',
			},
			'punctuation': punctuation,
		};

		parser['expression'].inside = {
			'string': {
				pattern: /(^|[^^])(["'])(?:(?!\2)[^^]|\^[\s\S])*\2/,
				lookbehind: true,
			},
			'keyword': parser.keyword,
			'variable': parser.variable,
			'function': parser.function,
			'boolean': /\b(?:false|true)\b/,
			'number': /\b(?:0x[a-f\d]+|\d+(?:\.\d*)?(?:e[+-]?\d+)?)\b/i,
			'escape': parser.escape,
			'operator':
				/[~+*\/\\%]|!(?:\|\|?|=)?|&&?|\|\|?|==|<[<=]?|>[>=]?|-[fd]?|\b(?:def|eq|ge|gt|in|is|le|lt|ne)\b/,
			'punctuation': punctuation,
		};

		return {
			...parser,
			$insertBefore: {
				'keyword': {
					'parser-comment': {
						pattern: /(\s)#.*/,
						lookbehind: true,
						alias: 'comment',
					},
				},
				'tag/attr-value/punctuation': {
					'expression': parser.expression,
					'keyword': parser.keyword,
					'variable': parser.variable,
					'function': parser.function,
					'escape': parser.escape,
					'parser-punctuation': {
						pattern: punctuation,
						alias: 'punctuation',
					},
				},
			},
		};
	},
};
