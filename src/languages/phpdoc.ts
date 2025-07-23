import { insertBefore } from '../util/language-util';
import javadoclike from './javadoclike';
import type { LanguageProto } from '../types';

export default {
	id: 'phpdoc',
	base: javadoclike,
	grammar ({ base }) {
		const typeExpression = /(?:\b[a-zA-Z]\w*|[|\\[\]])+/.source;

		insertBefore(base, 'keyword', {
			'class-name': [
				{
					pattern: RegExp(
						'(@(?:global|package|param|property(?:-read|-write)?|return|subpackage|throws|var)\\s+)' +
							typeExpression
					),
					lookbehind: true,
					inside: {
						'keyword':
							/\b(?:array|bool|boolean|callback|double|false|float|int|integer|mixed|null|object|resource|self|string|true|void)\b/,
						'punctuation': /[|\\[\]()]/,
					},
				},
			],
		});

		return {
			'parameter': {
				pattern: RegExp(
					'(@(?:global|param|property(?:-read|-write)?|var)\\s+(?:' +
						typeExpression +
						'\\s+)?)\\$\\w+'
				),
				lookbehind: true,
			},
		};
	},
} as LanguageProto<'phpdoc'>;
