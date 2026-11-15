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
			greedy: true,
		},

		'string': {
			pattern: /"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'/,
			greedy: true,
		},

		'regex': {
			pattern: /\/(?:(?:\\.|[^\\/\r\n])+\/[qisdlmucx]*|\/)/,
			greedy: true,
		},

		'slot': {
			pattern: /(^|[\s({])\.\s*[a-z][\w?!]*/i,
			lookbehind: true,
			greedy: true,
		},

		'pragma': {
			pattern: /_pragma.*/,
			alias: 'prolog',
			inside: {
				'modifier': /classify_level|topic|usage/,
				'pragma-punctuation': { pattern: /[={},]/ },
			},
		},

		'symbol': {
			pattern: /(^|\W):(?:\|[^|]*\||\\.|[\w?!])+/,
			lookbehind: true,
		},

		'global-reference': [
			{ pattern: /@(?:[a-z_]\w*:)?\|[^|]*\|/i, alias: 'symbol' }, // @|name| or @prefix:|name|
			{ pattern: /@(?:[a-z_]\w*:)?[a-z_]\w*/i, alias: 'symbol' }, // @name or @prefix:name
		],

		'dynamic-variable': [
			{ pattern: /\|![\w?!]+!\|/, alias: 'variable' }, // variable encased like |!var!|
			{ pattern: /\|![\w?!]+\|!/, alias: 'variable' }, // variable encased like |!var|!
			{ pattern: /!\|[\w?!]+\|!/, alias: 'variable' }, // variable encased like !|var!|
			{ pattern: /!\|\|!/, alias: 'variable' }, // empty variable !||!
			{ pattern: /[a-z_]+:![a-z][\w?!]*!/i, alias: 'variable' }, // variable with a prefix like sw:!var!
			{ pattern: /![a-z][\w?!]*!/i, alias: 'variable' }, // variable encased like !var!
		],

		'global-variable': [
			{ pattern: /[a-z_]+:[\w?!]+/i, alias: 'variable' }, // variable with a prefix like sw:gis_program_manager
			{ pattern: /[a-z_]+:\|[\w?!]+\|/i, alias: 'variable' }, // variable with a prefix like sw:|gis_program_manager|
		],

		'declaration': [
			{ pattern: /(\b_package\s+)\w+\b/i, lookbehind: true },
			{ pattern: /(\b_(?:constant|global|import|local)\s+)(?!_)\w+\b/i, lookbehind: true },
		],

		'number':
			/(?<!\|)(?:\b\d+(?:\.\d+)?(?:[e&][+-]?\d+)?\b|\b(?:[2-9]|[12]\d|3[0-6])r[a-z0-9]+\b)/i,

		'operator': [
			/_(?:and|andif|or|orif|xor)<</i,
			/(?:\*\*\^?|\*\^?|\/\^?|_mod\^?|_div\^?|-\^?|\+\^?)<</i,
			/\^?<</,
			/<>/,
			/>=/,
			/<=/,
			/</,
			/~=/,
			/=/,
			/\*\*/,
			/\*/,
			/\//,
			/\+/,
			/-/,
			/~/,
		],

		'keyword-operator': [
			{ pattern: /\b_(?:cf|is|isnt)\b/i, alias: 'keyword' }, // comparison
			{ pattern: /\b_(?:div|mod)\b/i, alias: 'keyword' }, // math
		],

		'keyword-variable': {
			pattern: /\b_(?:class|dynamic|global|import|local)\b/i,
			alias: 'keyword',
		},

		'keyword': [
			/\b_(?:block|endblock)\b/i, // block
			/\b_(?:elif|else|endif|if|then)\b/i, // if
			/\b_(?:and|andif|not|or|orif|xor)\b/i, // logical operators
			/\b_(?:continue|endloop|finally|for|leave|loop|loopbody|over|while)\b/i, // loop
			/\b_(?:default|handling)\b/i, // handling
			/\b_(?:catch|endcatch)\b/i, // catch
			/\b_throw\b/i, // throw
			/>>/,
			/\b_return\b/i,
			/\b_primitive\b/i, // primitive
			/\b_(?:endtry|try|when)\b/i, // try
			/\b_(?:endprotect|locking|protect|protection)\b/i, // protect
			/\b_(?:endlock|lock)\b/i, // lock
			/\b_with\b/i, // standalone since _finally, _handling, _throw, _try, _leave and _continue all can have this
			/\b_(?:allresults|gather|optional|scatter)\b/i, // parameter options
		],

		'builtin': /\b_(?:clone|package|super|thisthread)\b/i,

		'boolean': /\b_(?:false|maybe|true)\b/i,

		'punctuation': /[[\](){},;]/,

		'unset': {
			pattern: /\b_unset\b/i,
			alias: 'keyword',
		},

		'constant': {
			pattern: /\b_constant\b/i,
			alias: 'keyword',
		},

		'self': [
			{
				pattern: /(\b_method\s+)\S+(?=\.)/,
				lookbehind: true,
			},
			/\b_self\b/i,
		],

		'function': [
			/\b_(?:abstract|endmethod|iter|method|private)\b/i, // method keywords
			/\b_(?:endproc|proc)\b/i, // procedure
			{ pattern: /(\.)\s*\|[a-z][\w?!]*\|/, lookbehind: true }, // encased |methodNames|
			{ pattern: /(\.)\s*[a-z][\w?!]*/, lookbehind: true }, // methods
		],

		'variable': [
			/\|[\w?!]+\|/, // variable encased like |var|, |0|, |123|
			{ pattern: /(^|[^.])\b[a-z][\w?!]*/i, lookbehind: true },
		],
	},
};
