/** @type {import('../types.d.ts').LanguageProto<'magik'>} */
export default {
	id: 'magik',
	grammar: {
		'comment': [
			{ pattern: /##.*/, greedy: true }, // documentation
			{ pattern: /#.*/, greedy: true } // comment
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
			pattern: /\/(?:\/|(?:\\.|[^\\/\r\n])+\/[qisdlmuCX]*)/,
			greedy: true
		},

		'property': {
			pattern: /_pragma.*/,
			inside: {
				'modifier': /classify_level|topic|usage/,
				'punctuation': /[={},]/
			}
		},

		'operator': [
			/_(?:and|andif|or|orif|xor)<</, // compound logical assignment
			/(?:\*\*\^?|\*\^?|\/\^?|_mod\^?|_div\^?|-\^?|\+\^?)<</, // compound arithmetic assignment
			/\^<</, /<</, // assignment operators
			/>>/, /\b_return\b/, // return operators
			/\b_(?:cf|is|isnt)\b/, /<>/, />=/, /<=/, /</, />/, /~=/, /=/, // relational operators
			/\b_(?:and|andif|or|orif|xor)\b/, // logical operators
			/\*\*/, /\*/, /\//, /\b_(?:div|mod)\b/, // arithmetic operators
			/\+/, /-/, /\b_not\b/, /~/, // unary operators
		],

		'keyword': [
			/\b_(?:class|constant|dynamic|global|import|local)\b/, // variables,
			/\b_(?:abstract|endmethod|iter|method|private)\b/, // method
			/\b_(?:endproc|proc)\b/, // procedure
			/\b_(?:block|endblock)\b/, // block
			/\b_(?:elif|else|endif|if|then)\b/, // if
			/\b_(?:continue|endloop|finally|for|leave|loop|loopbody|over|while)\b/, // loop
			/\b_(?:default|handling)\b/, // handling
			/\b_(?:catch|endcatch)\b/, // catch
			/\b_throw\b/, // throw
			/\b_primitive\b/, // primitive
			/\b_(?:endtry|try|when)\b/, // try
			/\b_(?:endprotect|locking|protect|protection)\b/, // protect
			/\b_(?:endlock|lock)\b/, // lock
			/\b_with\b/ // standalone since _finally, _handling, _throw, _try, _leave and _continue all can have this
		],

		'builtin': [
			/\b_(?:clone|package|self|super|thisthread|unset)\b/
		],

		'boolean': /\b_(?:false|maybe|true)\b/,

		'variable': [
			/\|![\w?!]+!\|/, /\|![\w?!]+\|!/, /!\|[\w?!]+\|!/, /!\|\|!/, /![a-z][\w?!]*!/i, // dynamic variable
			/[a-z_]\w*:[a-z_]\w*/i, // global variable
			/@(?:[a-z_]\w*:)?[a-z_]\w*/i, // global reference
		],

		'symbol': /:(?:\|[^|]*\||[\w?!])+/,

		'number': /\b\d+(?:\.\d+)?(?:[e&][+-]?\d+)?\b|\b(?:[2-9]|[12]\d|3[0-6])r[a-z0-9]+\b/i,

		'punctuation': /[[\](){},;]/

	}
};
