import markup from './markup';
import type { GrammarToken, LanguageProto } from '../types';

export default {
	id: 'wiki',
	base: markup,
	grammar ({ base }) {
		const tag = base!['tag'] as GrammarToken;

		return {
			'block-comment': {
				pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
				lookbehind: true,
				alias: 'comment',
			},
			'heading': {
				pattern: /^(=+)[^=\r\n].*?\1/m,
				inside: {
					'punctuation': /^=+|=+$/,
					'important': /.+/,
				},
			},
			'emphasis': {
				// TODO Multi-line
				pattern: /('{2,5}).+?\1/,
				inside: {
					'bold-italic': {
						pattern: /(''''').+?(?=\1)/,
						lookbehind: true,
						alias: ['bold', 'italic'],
					},
					'bold': {
						pattern: /(''')[^'](?:.*?[^'])?(?=\1)/,
						lookbehind: true,
					},
					'italic': {
						pattern: /('')[^'](?:.*?[^'])?(?=\1)/,
						lookbehind: true,
					},
					'punctuation': /^''+|''+$/,
				},
			},
			'hr': {
				pattern: /^-{4,}/m,
				alias: 'punctuation',
			},
			'url': [
				/ISBN +(?:97[89][ -]?)?(?:\d[ -]?){9}[\dx]\b|(?:PMID|RFC) +\d+/i,
				/\[\[.+?\]\]|\[.+?\]/,
			],
			'variable': [
				/__[A-Z]+__/,
				// FIXME Nested structures should be handled
				// {{formatnum:{{#expr:{{{3}}}}}}}
				/\{{3}.+?\}{3}/,
				/\{\{.+?\}\}/,
			],
			'symbol': [/^#redirect/im, /~{3,5}/],
			// Handle table attrs:
			// {|
			// ! style="text-align:left;"| Item
			// |}
			'table-tag': {
				pattern: /((?:^|[|!])[|!])[^|\r\n]+\|(?!\|)/m,
				lookbehind: true,
				inside: {
					'table-bar': {
						pattern: /\|$/,
						alias: 'punctuation',
					},
					$rest: tag.inside,
				},
			},
			'punctuation': /^(?:\{\||\|\}|\|-|[*#:;!|])|\|\||!!/m,
			$insert: {
				// Prevent highlighting inside <nowiki>, <source> and <pre> tags
				'nowiki': {
					$before: 'tag',
					pattern: /<(nowiki|pre|source)\b[^>]*>[\s\S]*?<\/\1>/i,
					inside: {
						'tag': {
							pattern:
								/<(?:nowiki|pre|source)\b[^>]*>|<\/(?:nowiki|pre|source)>/i,
							inside: tag.inside,
						},
					},
				},
			},
		};
	},
} as LanguageProto<'wiki'>;
