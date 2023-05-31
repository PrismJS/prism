import { insertBefore } from '../shared/language-util';
import javadoclike from './prism-javadoclike';
import type { LanguageProto } from '../types';

export default {
	id: 'phpdoc',
	require: javadoclike,
	grammar({ extend }) {
		const typeExpression = /(?:\b[a-zA-Z]\w*|[|\\[\]])+/.source;

		const phpdoc = extend('javadoclike', {
			'parameter': {
				pattern: RegExp('(@(?:global|param|property(?:-read|-write)?|var)\\s+(?:' + typeExpression + '\\s+)?)\\$\\w+'),
				lookbehind: true
			}
		});

		insertBefore(phpdoc, 'keyword', {
			'class-name': [
				{
					pattern: RegExp('(@(?:global|package|param|property(?:-read|-write)?|return|subpackage|throws|var)\\s+)' + typeExpression),
					lookbehind: true,
					inside: {
						'keyword': /\b(?:array|bool|boolean|callback|double|false|float|int|integer|mixed|null|object|resource|self|string|true|void)\b/,
						'punctuation': /[|\\[\]()]/
					}
				}
			],
		});

		return phpdoc;
	}
} as LanguageProto<'phpdoc'>;
