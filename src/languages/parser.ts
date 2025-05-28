import markup from './markup';
import type { LanguageProto } from '../types';

export default {
	id: 'parser',
	base: markup,
	grammar ({ base }) {
		const punctuation = /[\[\](){};]/;

		return {
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
			$insertBefore: {
				'keyword': {
					'parser-comment': {
						pattern: /(\s)#.*/,
						lookbehind: true,
						alias: 'comment',
					},
					'expression': {
						// Allow for 3 levels of depth
						pattern: /(^|[^^])\((?:[^()]|\((?:[^()]|\((?:[^()])*\))*\))*\)/,
						greedy: true,
						lookbehind: true,
						inside: {
							'string': {
								pattern: /(^|[^^])(["'])(?:(?!\2)[^^]|\^[\s\S])*\2/,
								lookbehind: true,
							},
							'keyword': base!.keyword,
							'variable': base!.variable,
							'function': base!.function,
							'boolean': /\b(?:false|true)\b/,
							'number': /\b(?:0x[a-f\d]+|\d+(?:\.\d*)?(?:e[+-]?\d+)?)\b/i,
							'escape': base!.escape,
							'operator':
								/[~+*\/\\%]|!(?:\|\|?|=)?|&&?|\|\|?|==|<[<=]?|>[>=]?|-[fd]?|\b(?:def|eq|ge|gt|in|is|le|lt|ne)\b/,
							'punctuation': punctuation,
						},
					},
				},
				'tag/attr-value': {
					'punctuation': {
						'expression': base!.expression,
						'keyword': base!.keyword,
						'variable': base!.variable,
						'function': base!.function,
						'escape': base!.escape,
						'parser-punctuation': {
							pattern: punctuation,
							alias: 'punctuation',
						},
					},
				},
			},
		};
	},
} as LanguageProto<'parser'>;
