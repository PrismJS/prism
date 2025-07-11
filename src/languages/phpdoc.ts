import javadoclike from './javadoclike';
import type { LanguageProto } from '../types';

export default {
	id: 'phpdoc',
	base: javadoclike,
	grammar () {
		const typeExpression = /(?:\b[a-zA-Z]\w*|[|\\[\]])+/.source;

		return {
			'parameter': {
				pattern: RegExp(
					'(@(?:global|param|property(?:-read|-write)?|var)\\s+(?:' +
						typeExpression +
						'\\s+)?)\\$\\w+'
				),
				lookbehind: true,
			},
			$insert: {
				'class-name': {
					$before: 'keyword',
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
			},
		};
	},
} as LanguageProto<'phpdoc'>;
