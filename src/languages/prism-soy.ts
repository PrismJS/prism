import { embeddedIn } from '../shared/languages/templating';
import { tokenize } from '../shared/symbols';
import markup from './prism-markup';
import type { LanguageProto } from '../types';

export default {
	id: 'soy',
	require: markup,
	grammar() {
		const stringPattern = /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
		const numberPattern = /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\b0x[\dA-F]+\b/;

		return {
			'ignore-literal': {
				pattern: /(\{literal\})[\s\S]*?(?=\{\/literal\})/,
				lookbehind: true,
				greedy: true
			},
			'soy': {
				pattern: /\{\{.+?\}\}|\{.+?\}|\s\/\/.*|\/\*[\s\S]*?\*\//,
				greedy: true,
				inside: {
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
				}
			},
			[tokenize]: embeddedIn('markup')
		};
	}
} as LanguageProto<'soy'>;
