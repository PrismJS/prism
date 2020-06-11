Prism.languages.jsstacktrace = {
	'not-my-code': {
		pattern: /\s+at\s+(?:node\.js|\<unknown\>|.*(?:node_modules|\(\<anonymous\>\)|\(\<unknown\>|\<anonymous\>$|\(internal\/|\(node\.js)).*/m,
		alias: 'comment'
	},
	
	'error-message': {
		pattern: /^\S.*$/m,
		alias: 'string'
	},
	
	'stack-frame': {
		pattern: /^\s+at\s+.*$/m,
		inside: {
			'filename-direct': {
				pattern: /(\s+at\s+)(?:\/|[a-zA-Z]:)[^:]+/m,
				lookbehind: true,
				alias: 'url'
			},
			
			'function': {
				pattern: /(at\s+)(?:new\s+)?[a-zA-Z][a-zA-Z0-9-_<>.]+/,
				lookbehind: true
			},
			
			'keyword': /\b(?:at|new)\b/,
			
			'alias': {
				pattern: /\[(?:as\s+)?[a-zA-Z][a-zA-Z0-9-_]+\]/,
				alias: 'variable'
			},
			
			
			'filename': {
				pattern: /(\()[^):]+(?=[:)])/,
				lookbehind: true,
				alias: 'url'
			},
			
			'line-number': {
				pattern: /:[0-9]+(?::[0-9]+)?\b/i,
				lookbehind: true,
				alias: 'number'
			},
			
		}
	}
}
