import php from './prism-php.js';
import javadoclike from './prism-javadoclike.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'phpdoc',
	require: [php, javadoclike],
	grammar({ extend, getLanguage }) {
		let typeExpression = /(?:\b[a-zA-Z]\w*|[|\\[\]])+/.source;

		Prism.languages.phpdoc = extend('javadoclike', {
			'parameter': {
				pattern: RegExp('(@(?:global|param|property(?:-read|-write)?|var)\\s+(?:' + typeExpression + '\\s+)?)\\$\\w+'),
				lookbehind: true
			}
		});

		Prism.languages.insertBefore('phpdoc', 'keyword', {
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

		Prism.languages.javadoclike.addSupport('php', Prism.languages.phpdoc);
	}
});
