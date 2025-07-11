import markup from './markup';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'velocity',
	base: markup,
	grammar () {
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

		return {
			$merge: {
				'tag': {
					inside: {
						'attr-value': {
							inside: {
								$rest: 'velocity',
							} as unknown as Grammar,
						},
					},
				},
			},
			$insertBefore: {
				'comment': {
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
						inside: {
							'keyword': {
								pattern: /^#@?(?:[a-z][\w-]*|\{[a-z][\w-]*\})|\bin\b/,
								inside: {
									'punctuation': /[{}]/,
								},
							},
							$rest: vel,
						},
					},
					'variable': vel['variable'],
				},
			},
		};
	},
} as LanguageProto<'velocity'>;
