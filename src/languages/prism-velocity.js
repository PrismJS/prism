import { insertBefore } from '../shared/language-util';
import { rest } from '../shared/symbols';
import markup from './prism-markup';

export default /** @type {import("../types").LanguageProto<'velocity'>} */ ({
	id: 'velocity',
	require: markup,
	grammar({ extend }) {
		const velocity = extend('markup', {});

		const vel = {
			'variable': {
				pattern: /(^|[^\\](?:\\\\)*)\$!?(?:[a-z][\w-]*(?:\([^)]*\))?(?:\.[a-z][\w-]*(?:\([^)]*\))?|\[[^\]]+\])*|\{[^}]+\})/i,
				lookbehind: true,
				inside: {} // See below
			},
			'string': {
				pattern: /"[^"]*"|'[^']*'/,
				greedy: true
			},
			'number': /\b\d+\b/,
			'boolean': /\b(?:false|true)\b/,
			'operator': /[=!<>]=?|[+*/%-]|&&|\|\||\.\.|\b(?:eq|g[et]|l[et]|n(?:e|ot))\b/,
			'punctuation': /[(){}[\]:,.]/
		};

		vel.variable.inside = {
			'string': vel['string'],
			'function': {
				pattern: /([^\w-])[a-z][\w-]*(?=\()/,
				lookbehind: true
			},
			'number': vel['number'],
			'boolean': vel['boolean'],
			'punctuation': vel['punctuation']
		};

		insertBefore(velocity, 'comment', {
			'unparsed': {
				pattern: /(^|[^\\])#\[\[[\s\S]*?\]\]#/,
				lookbehind: true,
				greedy: true,
				inside: {
					'punctuation': /^#\[\[|\]\]#$/
				}
			},
			'velocity-comment': [
				{
					pattern: /(^|[^\\])#\*[\s\S]*?\*#/,
					lookbehind: true,
					greedy: true,
					alias: 'comment'
				},
				{
					pattern: /(^|[^\\])##.*/,
					lookbehind: true,
					greedy: true,
					alias: 'comment'
				}
			],
			'directive': {
				pattern: /(^|[^\\](?:\\\\)*)#@?(?:[a-z][\w-]*|\{[a-z][\w-]*\})(?:\s*\((?:[^()]|\([^()]*\))*\))?/i,
				lookbehind: true,
				inside: {
					'keyword': {
						pattern: /^#@?(?:[a-z][\w-]*|\{[a-z][\w-]*\})|\bin\b/,
						inside: {
							'punctuation': /[{}]/
						}
					},
					[rest]: vel
				}
			},
			'variable': vel['variable']
		});

		velocity['tag'].inside['attr-value'].inside[rest] = velocity;

		return velocity;
	}
});
