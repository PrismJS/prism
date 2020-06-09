Prism.languages.jsstacktrace = {
	'notmycode': {
		pattern: /\s+at\s+(?:node\.js|.*(?:node_modules|\(\<anonymous\>\)|\(internal\/|\(node\.js)).*/,
		alias: 'comment'
	},
	
	'error_message': {
		pattern: /(\n|^)\S.*/,
		lookbehind: true,
		alias: "string"
		// pattern: /\b[A-Z][a-ZA-Z]+(?=:)\b/
	},
	
	'function': {
		pattern: /(\s+at\s+(?:new\s+)?)[a-zA-Z_][a-zA-Z0-9-_<>.]+\b/,
		lookbehind: true
	},
	
	// 'error_code': {
	// 	pattern: /\[[A-Z]+[0-9]+\]/,
	// 	alias: "variable"
	// },
	
	'keyword': /\b(?:at|new)\b/,

	// 
	// 'filename': {
	// 	pattern: /(\(|^\s+at\s+)(?:[a-zA-Z]:)?[^):]+(?=\))/,
	// 	lookbehind: true,
	// 	alias: "string"
	// },

	// 'boolean': /\b(?:true|false)\b/,
	'line_number': {
		pattern: /([^e]):[0-9]+(?::[0-9]+)?\b/i,
		lookbehind: true,
		alias: "number"
	}
	// 'number': /\b-?(?:0x[0-9a-fA-F]+|[0-9]+)(?:\.[0-9a-fA-F]+)?\b/i,

	// 'punctuation': /[{}[\];(),:=]|IL_[0-9A-Za-z]+/
}
