import { insertBefore } from '../shared/language-util.js';
import clike from './prism-clike.js';

export default /** @type {import("../types").LanguageProto<'firestore-security-rules'>} */ ({
	id: 'firestore-security-rules',
	require: clike,
	grammar({ extend }) {
		const fsr = extend('clike', {
			'comment': /\/\/.*/,
			'keyword': /\b(?:allow|function|if|match|null|return|rules_version|service)\b/,
			'operator': /&&|\|\||[<>!=]=?|[-+*/%]|\b(?:in|is)\b/,
		});

		delete fsr['class-name'];

		insertBefore(fsr, 'keyword', {
			'path': {
				pattern: /(^|[\s(),])(?:\/(?:[\w\xA0-\uFFFF]+|\{[\w\xA0-\uFFFF]+(?:=\*\*)?\}|\$\([\w\xA0-\uFFFF.]+\)))+/,
				lookbehind: true,
				greedy: true,
				inside: {
					'variable': {
						pattern: /\{[\w\xA0-\uFFFF]+(?:=\*\*)?\}|\$\([\w\xA0-\uFFFF.]+\)/,
						inside: {
							'operator': /=/,
							'keyword': /\*\*/,
							'punctuation': /[.$(){}]/
						}
					},
					'punctuation': /\//
				}
			},
			'method': {
				// to make the pattern shorter, the actual method names are omitted
				pattern: /(\ballow\s+)[a-z]+(?:\s*,\s*[a-z]+)*(?=\s*[:;])/,
				lookbehind: true,
				alias: 'builtin',
				inside: {
					'punctuation': /,/
				}
			},
		});

		return fsr;
	}
});
