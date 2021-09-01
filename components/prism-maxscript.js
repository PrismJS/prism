Prism.languages.maxscript = {
	'comment': {
		pattern: /\/\*[\s\S]*?(?:\*\/|$)|--.*/,
		greedy: true
	},
	'string': {
		pattern: /(^|[^"\\@])(?:"(?:[^"\\]|\\[\s\S])*"|@"[^"]*")/,
		lookbehind: true,
		greedy: true
	},
	'path': {
		pattern: /\$(?:[\w/\\.*?]|'[^']*')*/,
		greedy: true,
		alias: 'string'
	},

	'function-definition': {
		pattern: /(\b(?:function|fn)\s+)\w+\b/,
		lookbehind: true,
		alias: 'function'
	},

	'argument': {
		pattern: /\b[a-z_]\w*(?=:)/i,
		alias: 'attr-name'
	},

	'keyword': /\b(?:about|and|animate|as|at|attributes|by|case|catch|collect|continue|coordsys|do|else|exit|fn|for|from|function|global|if|in|local|macroscript|mapped|max|not|of|off|on|or|parameters|persistent|plugin|rcmenu|return|rollout|set|struct|then|throw|to|tool|try|undo|utility|when|where|while|with)\b/i,
	'boolean': /\b(?:true|false|on|off)\b/,

	'time': {
		pattern: /(^|[^\w.])(?:(?:(?:\d+(?:\.\d*)?|\.\d+)(?:[eEdD][+-]\d+|[LP])?[msft])+|\d+:\d+(?:\.\d*)?)(?![\w.:])/,
		lookbehind: true,
		alias: 'number'
	},
	'number': [
		{
			pattern: /(^|[^\w.])(?:(?:\d+(?:\.\d*)?|\.\d+)(?:[eEdD][+-]\d+|[LP])?|0x[a-fA-F0-9]+)(?![\w.:])/,
			lookbehind: true
		},
		/\b(?:e|pi)\b/
	],

	'constant': /\b(?:black|blue|brown|gray|green|orange|red|white|yellow)\b/,
	'color': {
		pattern: /\b(?:dontcollect|ok|silentValue|undefined|unsupplied)\b/i,
		alias: 'constant'
	},

	'operator': /[-+*/<>=!]=?|[&^]|#(?!\()/,
	'punctuation': /[()\[\]{}.:,;]|#(?=\()|\\$/m
};
