Prism.languages.jsstacktrace = {
	'not-my-code': {
		pattern: /[ \t]+at[ \t]+(?:node\.js|\<unknown\>|.*(?:node_modules|\(\<anonymous\>\)|\(\<unknown\>|\<anonymous\>$|\(internal\/|\(node\.js)).*/m,
		alias: 'comment'
	},
	
	'error-message': {
		pattern: /^\S.*/m,
		alias: 'string'
	},
	
	'stack-frame': {
		pattern: /^[ \t]+at[ \t]+.*/m,
		inside: {
			'filename-direct': {
				pattern: /(\s+at\s+)(?:\/|[a-zA-Z]:)[^:]+/,
				lookbehind: true,
				alias: 'url'
			},
			
			'function': {
				pattern: /(at\s+(?:new\s+)?)[_$a-zA-Z\xA0-\uFFFF][.$\w\xA0-\uFFFF]*/,
				lookbehind: true,
				inside: {
					'punctuation': /\./
				}
			},
			
			'punctuation': /[()]/,
			
			'keyword': /\b(?:at|new)\b/,
			
			'alias': {
				pattern: /\[(?:as\s+)?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\]/,
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
