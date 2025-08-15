import { insertBefore } from '../util/language-util.js';
import markup from './markup.js';

/** @type {import('../types.d.ts').LanguageProto<'velocity'>} */
export default {
	id: 'velocity',
	base: markup,
	grammar ({ base }) {
		const vel = {
			'variable': {
				pattern:
					/(^|[^\\](?:\\\\)*)\$!?(?:[a-z][\w-]*(?:\([^)]*\))?(?:\.[a-z][\w-]*(?:\([^)]*\))?|\[[^\]]+\])*|\{[^}]+\})/i,
				lookbehind: true,
				inside: {}, // See below
			},
			'string': {
				pattern: /"[^"]*"|'[^']*'/,
				greedy: true,
			},
			'number': /\b\d+\b/,
			'boolean': /\b(?:false|true)\b/,
			'operator': /[=!<>]=?|[+*/%-]|&&|\|\||\.\.|\b(?:eq|g[et]|l[et]|n(?:e|ot))\b/,
			'punctuation': /[(){}[\]:,.]/,
		};

		vel.variable.inside = {
			'string': vel['string'],
			'function': {
				pattern: /([^\w-])[a-z][\w-]*(?=\()/,
				lookbehind: true,
			},
			'number': vel['number'],
			'boolean': vel['boolean'],
			'punctuation': vel['punctuation'],
		};

		insertBefore(base, 'comment', {
			'unparsed': {
				pattern: /(^|[^\\])#\[\[[\s\S]*?\]\]#/,
				lookbehind: true,
				greedy: true,
				inside: {
					'punctuation': /^#\[\[|\]\]#$/,
				},
			},
			'velocity-comment': [
				{
					pattern: /(^|[^\\])#\*[\s\S]*?\*#/,
					lookbehind: true,
					greedy: true,
					alias: 'comment',
				},
				{
					pattern: /(^|[^\\])##.*/,
					lookbehind: true,
					greedy: true,
					alias: 'comment',
				},
			],
			'directive': {
				pattern:
					/(^|[^\\](?:\\\\)*)#@?(?:[a-z][\w-]*|\{[a-z][\w-]*\})(?:\s*\((?:[^()]|\([^()]*\))*\))?/i,
				lookbehind: true,
				inside: /** @type {Grammar} */ ({
					'keyword': {
						pattern: /^#@?(?:[a-z][\w-]*|\{[a-z][\w-]*\})|\bin\b/,
						inside: {
							'punctuation': /[{}]/,
						},
					},
					$rest: /** @type {Grammar['$rest']} */ (vel),
				}),
			},
			'variable': vel['variable'],
		});

		/** @type {Grammar} */ (
			/** @type {GrammarToken} */ (
				/** @type {Grammar} */ (/** @type {GrammarToken} */ (base['tag']).inside)[
					'attr-value'
				]
			).inside
		).$rest = 'velocity';

		return {};
	},
};

/**
 * @typedef {import('../types.d.ts').Grammar} Grammar
 * @typedef {import('../types.d.ts').GrammarToken} GrammarToken
 */
