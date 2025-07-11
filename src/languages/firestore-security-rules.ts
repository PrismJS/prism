import clike from './clike';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'firestore-security-rules',
	base: clike,
	grammar (): Grammar {
		return {
			'comment': /\/\/.*/,
			'keyword': /\b(?:allow|function|if|match|null|return|rules_version|service)\b/,
			'operator': /&&|\|\||[<>!=]=?|[-+*/%]|\b(?:in|is)\b/,
			$insertBefore: {
				'keyword': {
					'path': {
						pattern:
							/(^|[\s(),])(?:\/(?:[\w\xA0-\uFFFF]+|\{[\w\xA0-\uFFFF]+(?:=\*\*)?\}|\$\([\w\xA0-\uFFFF.]+\)))+/,
						lookbehind: true,
						greedy: true,
						inside: {
							'variable': {
								pattern: /\{[\w\xA0-\uFFFF]+(?:=\*\*)?\}|\$\([\w\xA0-\uFFFF.]+\)/,
								inside: {
									'operator': /=/,
									'keyword': /\*\*/,
									'punctuation': /[.$(){}]/,
								},
							},
							'punctuation': /\//,
						},
					},
					'method': {
						// to make the pattern shorter, the actual method names are omitted
						pattern: /(\ballow\s+)[a-z]+(?:\s*,\s*[a-z]+)*(?=\s*[:;])/,
						lookbehind: true,
						alias: 'builtin',
						inside: {
							'punctuation': /,/,
						},
					},
				},
			},
			$delete: ['class-name'],
		};
	},
} as LanguageProto<'firestore-security-rules'>;
