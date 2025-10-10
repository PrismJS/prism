import { toArray } from '../util/iterables.js';
import clike from './clike.js';

/** @type {import('../types.d.ts').LanguageProto<'squirrel'>} */
export default {
	id: 'squirrel',
	base: clike,
	grammar ({ base }) {
		return {
			'comment': [
				...toArray(/** @type {import('../types.d.ts').GrammarTokens} */ (base).comment),
				{
					pattern: /#.*/,
					greedy: true,
				},
			],
			'string': {
				pattern: /(^|[^\\"'@])(?:@"(?:[^"]|"")*"(?!")|"(?:[^\\\r\n"]|\\.)*")/,
				lookbehind: true,
				greedy: true,
			},

			'class-name': {
				pattern: /(\b(?:class|enum|extends|instanceof)\s+)\w+(?:\.\w+)*/,
				lookbehind: true,
				inside: {
					'punctuation': /\./,
				},
			},
			'keyword':
				/\b(?:__FILE__|__LINE__|base|break|case|catch|class|clone|const|constructor|continue|default|delete|else|enum|extends|for|foreach|function|if|in|instanceof|local|null|resume|return|static|switch|this|throw|try|typeof|while|yield)\b/,

			'number': /\b(?:0x[0-9a-fA-F]+|\d+(?:\.(?:\d+|[eE][+-]?\d+))?)\b/,
			'operator': /\+\+|--|<=>|<[-<]|>>>?|&&?|\|\|?|[-+*/%!=<>]=?|[~^]|::?/,
			'punctuation': /[(){}\[\],;.]/,
			$insert: {
				'char': {
					$before: 'string',
					pattern: /(^|[^\\"'])'(?:[^\\']|\\(?:[xuU][0-9a-fA-F]{0,8}|[\s\S]))'/,
					lookbehind: true,
					greedy: true,
				},
				'attribute-punctuation': {
					$before: 'operator',
					pattern: /<\/|\/>/,
					alias: 'important',
				},
				'lambda': {
					$before: 'operator',
					pattern: /@(?=\()/,
					alias: 'operator',
				},
			},
		};
	},
};
