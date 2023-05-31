import type { LanguageProto } from '../types';

export default {
	id: 'awk',
	alias: 'gawk',
	grammar: {
		'hashbang': {
			pattern: /^#!.*/,
			greedy: true,
			alias: 'comment'
		},
		'comment': {
			pattern: /#.*/,
			greedy: true
		},
		'string': {
			pattern: /(^|[^\\])"(?:[^\\"\r\n]|\\.)*"/,
			lookbehind: true,
			greedy: true
		},
		'regex': {
			pattern: /((?:^|[^\w\s)])\s*)\/(?:[^\/\\\r\n]|\\.)*\//,
			lookbehind: true,
			greedy: true
		},

		'variable': /\$\w+/,
		'keyword': /\b(?:BEGIN|BEGINFILE|END|ENDFILE|break|case|continue|default|delete|do|else|exit|for|function|getline|if|in|next|nextfile|printf?|return|switch|while)\b|@(?:include|load)\b/,

		'function': /\b[a-z_]\w*(?=\s*\()/i,
		'number': /\b(?:\d+(?:\.\d+)?(?:e[+-]?\d+)?|0x[a-fA-F0-9]+)\b/,

		'operator': /--|\+\+|!?~|>&|>>|<<|(?:\*\*|[<>!=+\-*/%^])=?|&&|\|[|&]|[?:]/,
		'punctuation': /[()[\]{},;]/
	}
} as LanguageProto<'awk'>;
