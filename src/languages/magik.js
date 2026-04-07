/** @type {import('../types.d.ts').LanguageProto<'magik'>} */
export default {
	id: 'magik',
	grammar: {
		'comment': [
			{ pattern: /##.*/, greedy: true, alias: 'documentation' }, // documentation
			{ pattern: /#(?!#).*/, greedy: true }, // comments
		],

		'char': {
			pattern: /%(?:[a-z][\w?!]*|.)/i,
			greedy: true
		},

		'string': {
			pattern: /"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'/,
			greedy: true
		},

		'regex': {
			pattern: /\/(?:(?:\\.|[^\\/\r\n])+\/[qisdlmucx]*|\/)/,
			greedy: true
		},

		'declaration': [
			{ pattern: /(\b_package\s+).*/i, lookbehind: true },
			{ pattern: /(\b_global\s+)(?!_)\w+/i, lookbehind: true },
			{ pattern: /(\b_constant\s+)[a-z_]+/i, lookbehind: true }
		],

		'pragma': {
			pattern: /_pragma.*/,
			alias: 'prolog',
			inside: {
				'modifier': /classify_level|topic|usage/,
				'pragma-punctuation': { pattern: /[={},]/ }
			}
		},

		'number': /\b\d+(?:\.\d+)?(?:[e&][+-]?\d+)?\b|\b(?:[2-9]|[12]\d|3[0-6])r[a-z0-9]+\b/i,

		'symbol': {
			pattern: /(^|\W):(?:\|[^|]*\||\\.|[\w?!])+/,
			lookbehind: true
		},

		'operator': [
			/_(?:and|andif|or|orif|xor)<</i, /(?:\*\*\^?|\*\^?|\/\^?|_mod\^?|_div\^?|-\^?|\+\^?)<</i, /\^?<</, // assignment operators
			/<>/, />=/, /<=/, /</, /~=/, /=/, // relational operators
			/\*\*/, /\*/, /\//, // arithmetic operators
			/\+/, /-/, /~/, // unary operators
		],

		'keyword-operator': [
			{ pattern: /\b_(?:cf|is|isnt)\b/i, alias: 'keyword' }, // comparison
			{ pattern: /\b_(?:div|mod)\b/i, alias: 'keyword' } // math
		],

		'keyword': [
			/\b_(?:class|dynamic|global|import|local)\b/i, // variables
			/\b_(?:block|endblock)\b/i, // block
			/\b_(?:elif|else|endif|if|then)\b/i, // if
			/\b_(?:and|andif|not|or|orif|xor)\b/i, // logical operators
			/\b_(?:continue|endloop|finally|for|leave|loop|loopbody|over|while)\b/i, // loop
			/\b_(?:default|handling)\b/i, // handling
			/\b_(?:catch|endcatch)\b/i, // catch
			/\b_throw\b/i, // throw
			/>>/, /\b_return\b/i, // return
			/\b_primitive\b/i, // primitive
			/\b_(?:endtry|try|when)\b/i, // try
			/\b_(?:endprotect|locking|protect|protection)\b/i, // protect
			/\b_(?:endlock|lock)\b/i, // lock
			/\b_with\b/i, // standalone since _finally, _handling, _throw, _try, _leave and _continue all can have this
			/\b_(?:allresults|gather|optional|scatter)\b/i // parameter options
		],

		'slot': {
			pattern: /(^|[\s({])\.\s*[a-z_]+/i,
			lookbehind: true
		},

		'builtin': /\b_(?:clone|package|super|thisthread)\b/i,

		'boolean': /\b_(?:false|maybe|true)\b/i,

		'punctuation': /[[\](){},;]/,

		'unset': {
			pattern: /\b_unset\b/i,
			alias: 'symbol'
		},

		'constant': {
			pattern: /\b_constant\b/i,
			alias: 'symbol'
		},

		'global-reference': {
			pattern: /@(?:[a-z_]\w*:)?[a-z_]\w*/i,
			alias: 'symbol'
		},

		'self': [
			{
				pattern: /(\b_method\s+)\S+(?=\.)/,
				lookbehind: true
			},
			/\b_self\b/i
		],

		'function': [
			/\b_(?:abstract|endmethod|iter|method|private)\b/i, // method keywords
			/\b_(?:endproc|proc)\b/i, // procedure
			{ pattern: /(\.)\s*\|[a-z_]\w*[!?]?\|/, lookbehind: true }, // encased |methodNames|
			{ pattern: /(\.)\s*[a-z_]\w*[!?]?/, lookbehind: true }, // methods
		],

		'variable': [
			/\|![\w?!]+!\|/, // variable encased like |!var!|
			/\|![\w?!]+\|!/, // variable encased like |!var|!
			/!\|[\w?!]+\|!/, // variable encased like !|var!|
			/!\|\|!/, // empty variable !||!
			/![a-z][\w?!]*!/, // variable encased like !var!
			/\b[a-z_]+:\w+\b/i, // variable with a prefix like sw:gis_program_manager
			{ pattern: /(^|[^.])\b[a-z]\w*\b/i, lookbehind: true }
		],
	}
};
