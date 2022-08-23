import javascript from './prism-javascript.js';
import javadoclike from './prism-javadoclike.js';
import typescript from './prism-typescript.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'jsdoc',
	require: [javascript, javadoclike, typescript],
	optional: ['actionscript', 'coffeescript'],
	grammar({ extend, getLanguage }) {
		let javascript = Prism.languages.javascript;

		let type = /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/.source;
		let parameterPrefix = '(@(?:arg|argument|param|property)\\s+(?:' + type + '\\s+)?)';

		Prism.languages.jsdoc = extend('javadoclike', {
			'parameter': {
				// @param {string} foo - foo bar
				pattern: RegExp(parameterPrefix + /(?:(?!\s)[$\w\xA0-\uFFFF.])+(?=\s|$)/.source),
				lookbehind: true,
				inside: {
					'punctuation': /\./
				}
			}
		});

		Prism.languages.insertBefore('jsdoc', 'keyword', {
			'optional-parameter': {
				// @param {string} [baz.foo="bar"] foo bar
				pattern: RegExp(parameterPrefix + /\[(?:(?!\s)[$\w\xA0-\uFFFF.])+(?:=[^[\]]+)?\](?=\s|$)/.source),
				lookbehind: true,
				inside: {
					'parameter': {
						pattern: /(^\[)[$\w\xA0-\uFFFF\.]+/,
						lookbehind: true,
						inside: {
							'punctuation': /\./
						}
					},
					'code': {
						pattern: /(=)[\s\S]*(?=\]$)/,
						lookbehind: true,
						inside: javascript,
						alias: 'language-javascript'
					},
					'punctuation': /[=[\]]/
				}
			},
			'class-name': [
				{
					pattern: RegExp(/(@(?:augments|class|extends|interface|memberof!?|template|this|typedef)\s+(?:<TYPE>\s+)?)[A-Z]\w*(?:\.[A-Z]\w*)*/.source.replace(/<TYPE>/g, function () { return type; })),
					lookbehind: true,
					inside: {
						'punctuation': /\./
					}
				},
				{
					pattern: RegExp('(@[a-z]+\\s+)' + type),
					lookbehind: true,
					inside: {
						'string': javascript.string,
						'number': javascript.number,
						'boolean': javascript.boolean,
						'keyword': Prism.languages.typescript.keyword,
						'operator': /=>|\.\.\.|[&|?:*]/,
						'punctuation': /[.,;=<>{}()[\]]/
					}
				}
			],
			'example': {
				pattern: /(@example\s+(?!\s))(?:[^@\s]|\s+(?!\s))+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,
				lookbehind: true,
				inside: {
					'code': {
						pattern: /^([\t ]*(?:\*\s*)?)\S.*$/m,
						lookbehind: true,
						inside: javascript,
						alias: 'language-javascript'
					}
				}
			}
		});

		Prism.languages.javadoclike.addSupport('javascript', Prism.languages.jsdoc);
	}
});
