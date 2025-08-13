import { insertBefore } from '../util/language-util.js';
import clike from './clike.js';

/** @type {import('../types.d.ts').LanguageProto<'firestore-security-rules'>} */
export default {
	id: 'firestore-security-rules',
	base: clike,
	grammar ({ base }) {
		delete base['class-name'];

		insertBefore(base, 'keyword', {
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
		});

		return {
			'comment': /\/\/.*/,
			'keyword': /\b(?:allow|function|if|match|null|return|rules_version|service)\b/,
			'operator': /&&|\|\||[<>!=]=?|[-+*/%]|\b(?:in|is)\b/,
		};
	},
};
