import css from './css';
import type { LanguageProto } from '../types';

export default {
	id: 'less',
	base: css,
	grammar () {
		/* FIXME :
		 :extend() is not handled specifically : its highlighting is buggy.
		 Mixin usage must be inside a ruleset to be highlighted.
		 At-rules (e.g. import) containing interpolations are buggy.
		 Detached rulesets are highlighted as at-rules.
		 A comment before a mixin usage prevents the latter to be properly highlighted.
		 */

		return {
			'comment': [
				/\/\*[\s\S]*?\*\//,
				{
					pattern: /(^|[^\\])\/\/.*/,
					lookbehind: true,
				},
			],
			'atrule': {
				pattern: /@[\w-](?:\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};\s]|\s+(?!\s))*?(?=\s*\{)/,
				inside: {
					'punctuation': /[:()]/,
				},
			},
			// selectors and mixins are considered the same
			'selector': {
				pattern:
					/(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};@\s]|\s+(?!\s))*?(?=\s*\{)/,
				inside: {
					// mixin parameters
					'variable': /@+[\w-]+/,
				},
			},

			'property': /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/,
			'operator': /[+\-*\/]/,

			$insertBefore: {
				'property': {
					'variable': [
						// Variable declaration (the colon must be consumed!)
						{
							pattern: /@[\w-]+\s*:/,
							inside: {
								'punctuation': /:/,
							},
						},

						// Variable usage
						/@@?[\w-]+/,
					],
					'mixin-usage': {
						pattern: /([{;]\s*)[.#](?!\d)[\w-].*?(?=[(;])/,
						lookbehind: true,
						alias: 'function',
					},
				},
			},
		};
	},
} as LanguageProto<'less'>;
