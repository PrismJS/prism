import type { Grammar, GrammarToken } from '../../types';

function createBlock (prefix: string, insideLang: string | Grammar): GrammarToken {
	return {
		pattern: RegExp('<#' + prefix + '[\\s\\S]*?#>'),
		alias: 'block',
		inside: {
			'delimiter': {
				pattern: RegExp('^<#' + prefix + '|#>$'),
				alias: 'important',
			},
			'content': {
				pattern: /[\s\S]+/,
				inside: insideLang,
				alias: typeof insideLang === 'string' ? 'language-' + insideLang : undefined,
			},
		},
	};
}

export function createT4 (insideLang: string): Grammar {
	return {
		'block': {
			pattern: /<#[\s\S]+?#>/,
			inside: {
				'directive': createBlock('@', {
					'attr-value': {
						pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/,
						inside: {
							'punctuation': /^=|^["']|["']$/,
						},
					},
					'keyword': /\b\w+(?=\s)/,
					'attr-name': /\b\w+/,
				}),
				'expression': createBlock('=', insideLang),
				'class-feature': createBlock('\\+', insideLang),
				'standard': createBlock('', insideLang),
			},
		},
	};
}
