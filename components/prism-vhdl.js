Prism.languages.vhdl = {
	'comment': /(--[^\r\n]+)/,
	// support for all logic vectors
	'vhdl-vectors': {
		'pattern': /(\b[oOxXbB]"[\dA-Fa-f_]+"|"[UuXx01ZzWwLlHh-]+")/,
		'alias': 'number'
	},
	'string': /(")(\\\n|\\?.)*?"/,
	'constant': /\b(use|library)\b/i,
	// support for predefined attributes included
	'keyword': /\b(access|after|alias|all|architecture|array|assert|attribute|begin|block|body|buffer|bus|case|component|configuration|constant|disconnect|downto|else|elsif|end|entity|exit|file|for|function|generate|generic|group|guarded|if|impure|in|inertial|inout|is|label|library|linkage|literal|loop|map|new|next|null|of|on|open|others|out|package|port|postponed|procedure|process|pure|range|record|register|reject|report|return|select|severity|signal|shared|subtype|then|to|transport|type|unaffected|units|until|use|variable|wait|when|while|with|'base|'left|'right|'high|'low|'ascending|'image|'value|'pos|'val|'succ|'pred|'leftof|'rightof|'left|'left|'right|'right|'high|'high|'low|'low|'range|'range|'reverse_range|'reverse_range|'length|'length|'ascending|'ascending|'delayed|'stable|'stable|'quiet|'quiet|'transaction|'event|'active|'last_event|'last_active|'last_value|'driving|'driving_value|'simple_name|'instance_name|'path_name)\b/i,
	'boolean': /\b(true|false)\b/i,
	'function': {
		// support for operator overloading included
		pattern: /([a-z0-9_]+|"\S+")\(/i,
		inside: {
			punctuation: /\(/
		}
	},
	// decimal, based, physical, and exponential numbers supported
	'number': /('[UuXx01ZzWwLlHh-]'|\b\d+([_.]+)?(#[\dA-Fa-f_.]+#)?([eE][-+]?\d+)?)/,
	'operator': /[-+]{1}|<=?|>=?|=|:=|&|\*|\/|\b(abs|not|mod|rem|sll|srl|sla|sra|rol|ror|and|or|nand|xnor|xor|nor)\b/i,
	'punctuation': /[{}[\];(),.:]/
};
