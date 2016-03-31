Prism.languages.bro = {
    'comment': [
        {
	        pattern: /(^|[^\\$])#.*/,
		            	lookbehind: true
		            }
	],

    'string': /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,

    'boolean': /\b(T|F)\b/,

    'keyword': [
        /\b(break|next|continue)\b/,
        /\b(alarm|using|of|add|delete)\b/,
		/\b(default|export|event)\b/,
        /\b(print|redef|return|schedule)\b/,
		/\b(when|timeout)\b/,
		/\b(addr|any|bool|count)\b/,
		/\b(double|enum)\b/,
		/\b(file|int|interval)\b/,
		/\b(pattern)\b/,
		/\b(port|record|set)\b/,
		/\b(string|subnet|table)\b/,
		/\b(time|vector)\b/,
		/\b(for|if|else)\b/,
		/\b(day|hr|min|sec|usec)s\b/
		    
        
	],
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	
	'function': 
	{
		pattern: /function [a-z0-9_]+/i,
		inside: {
			keyword: /function/
		}
	},
	
	'variable':	
	[{
		pattern: /global [a-z0-9_]+/i,
		inside: {
			keyword: /global/
		}
	},
	{
		pattern: /local [a-z0-9_]+/i,
		inside: {
			keyword: /local/
		}
	}],
	
	
	'number': [     
	     /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	     
     ],
    
    'italic':  /\b(TODO|FIXME|XXX)\b/,
	'punctuation': /[{}[\];(),.:]/,
	
	'builtin': [
	     /@load\s+/,
	     /@load-sigs\s+/,
	     /@load-plugin\s+/,
	     /@unload\s+/,
	     /@prefixes\s+/,
	     /@if\s+/,
	     /@ifdef\s+/,
	     /@ifndef\s+/,
	     /@else\s+/,
	     /@endif\s+/,
	     /@DIR\s+/,
	     /@FILENAME\s+/
	],
	
	'constant': 
	{
		pattern: /const [a-z0-9_]+/i,
		inside: {
			keyword: /const/
		}
	},
};
