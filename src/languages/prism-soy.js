import { addHooks } from '../shared/hooks-util';
import markupTemplating, { MarkupTemplating } from './prism-markup-templating';

export default /** @type {import("../types").LanguageProto<'soy'>} */ ({
	id: 'soy',
	require: markupTemplating,
	grammar() {
		const stringPattern = /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
		const numberPattern = /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\b0x[\dA-F]+\b/;

		return {
			'comment': [
				/\/\*[\s\S]*?\*\//,
				{
					pattern: /(\s)\/\/.*/,
					lookbehind: true,
					greedy: true
				}
			],
			'command-arg': {
				pattern: /(\{+\/?\s*(?:alias|call|delcall|delpackage|deltemplate|namespace|template)\s+)\.?[\w.]+/,
				lookbehind: true,
				alias: 'string',
				inside: {
					'punctuation': /\./
				}
			},
			'parameter': {
				pattern: /(\{+\/?\s*@?param\??\s+)\.?[\w.]+/,
				lookbehind: true,
				alias: 'variable'
			},
			'keyword': [
				{
					pattern: /(\{+\/?[^\S\r\n]*)(?:\\[nrt]|alias|call|case|css|default|delcall|delpackage|deltemplate|else(?:if)?|fallbackmsg|for(?:each)?|if(?:empty)?|lb|let|literal|msg|namespace|nil|@?param\??|rb|sp|switch|template|xid)/,
					lookbehind: true
				},
				/\b(?:any|as|attributes|bool|css|float|html|in|int|js|list|map|null|number|string|uri)\b/
			],
			'delimiter': {
				pattern: /^\{+\/?|\/?\}+$/,
				alias: 'punctuation'
			},
			'property': /\w+(?==)/,
			'variable': {
				pattern: /\$[^\W\d]\w*(?:\??(?:\.\w+|\[[^\]]+\]))*/,
				inside: {
					'string': {
						pattern: stringPattern,
						greedy: true
					},
					'number': numberPattern,
					'punctuation': /[\[\].?]/
				}
			},
			'string': {
				pattern: stringPattern,
				greedy: true
			},
			'function': [
				/\w+(?=\()/,
				{
					pattern: /(\|[^\S\r\n]*)\w+/,
					lookbehind: true
				}
			],
			'boolean': /\b(?:false|true)\b/,
			'number': numberPattern,
			'operator': /\?:?|<=?|>=?|==?|!=|[+*/%-]|\b(?:and|not|or)\b/,
			'punctuation': /[{}()\[\]|.,:]/
		};
	},
	effect(Prism) {
		const templating = new MarkupTemplating(this.id, Prism);

		return addHooks(Prism.hooks, {
			'before-tokenize': (env) => {
				// Tokenize all inline Soy expressions
				const soyPattern = /\{\{.+?\}\}|\{.+?\}|\s\/\/.*|\/\*[\s\S]*?\*\//g;
				const soyLitteralStart = '{literal}';
				const soyLitteralEnd = '{/literal}';
				let soyLitteralMode = false;

				templating.buildPlaceholders(env, soyPattern, (match) => {
					// Soy tags inside {literal} block are ignored
					if (match === soyLitteralEnd) {
						soyLitteralMode = false;
					}

					if (!soyLitteralMode) {
						if (match === soyLitteralStart) {
							soyLitteralMode = true;
						}

						return true;
					}
					return false;
				});
			},
			'after-tokenize': (env) => {
				// Re-insert the tokens after tokenizing
				templating.tokenizePlaceholders(env);
			},
		});
	}
});
