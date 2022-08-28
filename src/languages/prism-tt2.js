import { insertBefore } from '../shared/language-util';
import clike from './prism-clike';
import markupTemplating, { MarkupTemplating } from './prism-markup-templating';

export default /** @type {import("../types").LanguageProto<'tt2'>} */ ({
	id: 'tt2',
	require: [clike, markupTemplating],
	grammar({ extend }) {
		const tt2 = extend('clike', {
			'comment': /#.*|\[%#[\s\S]*?%\]/,
			'keyword': /\b(?:BLOCK|CALL|CASE|CATCH|CLEAR|DEBUG|DEFAULT|ELSE|ELSIF|END|FILTER|FINAL|FOREACH|GET|IF|IN|INCLUDE|INSERT|LAST|MACRO|META|NEXT|PERL|PROCESS|RAWPERL|RETURN|SET|STOP|SWITCH|TAGS|THROW|TRY|UNLESS|USE|WHILE|WRAPPER)\b/,
			'punctuation': /[[\]{},()]/
		});

		insertBefore(tt2, 'number', {
			'operator': /=[>=]?|!=?|<=?|>=?|&&|\|\|?|\b(?:and|not|or)\b/,
			'variable': {
				pattern: /\b[a-z]\w*(?:\s*\.\s*(?:\d+|\$?[a-z]\w*))*\b/i
			}
		});

		insertBefore(tt2, 'keyword', {
			'delimiter': {
				pattern: /^(?:\[%|%%)-?|-?%\]$/,
				alias: 'punctuation'
			}
		});

		insertBefore(tt2, 'string', {
			'single-quoted-string': {
				pattern: /'[^\\']*(?:\\[\s\S][^\\']*)*'/,
				greedy: true,
				alias: 'string'
			},
			'double-quoted-string': {
				pattern: /"[^\\"]*(?:\\[\s\S][^\\"]*)*"/,
				greedy: true,
				alias: 'string',
				inside: {
					'variable': {
						pattern: /\$(?:[a-z]\w*(?:\.(?:\d+|\$?[a-z]\w*))*)/i
					}
				}
			}
		});

		// The different types of TT2 strings "replace" the C-like standard string
		delete tt2.string;

		return tt2;
	},
	effect(Prism) {
		const pattern = /\[%[\s\S]+?%\]/g;
		return new MarkupTemplating(this.id, Prism).addHooks(pattern);
	}
});
