(function (Prism) {
	// 1. Does not start from "
	// 2. Can start from ` and end with `, containing any character
	// 3. Starts with underscore or { or } and have more than 1 character after it
	// 4. Starts with letter, contains letters, numbers and underscores
	var identifier = /(?!")(`([^`]+)`|((?=_)_|(?=\{)\{|(?=\})\}|(?![_`{}]))([^;,\[\]\(\)\s~.]+))/;
	var string = /"[^\n"]+"[Hhcusa]?/;
	var number = /\b([\d_]+|0x[\d_a-fA-F]+|0b[1_0]+)\b/;

	Prism.languages.func = {
		'include': {
			pattern: /#include(.*);/,
			inside: {
				'keyword': /#include/,
				'string': string,
				'punctuation': /;/
			},
		},
		'pragma': {
			pattern: /#pragma(.*);/,
			inside: {
				'keyword': /#pragma|not-version|version/,
				'number': /(\d+)(.\d+)?(.\d+)?/,
				'operator': [/>=/, /<=/, /=/, />/, /</, /\^/],
				'punctuation': /;/
			}
		},

		'comment': [
			{
				pattern: /;;.*/,
				lookbehind: true,
				greedy: true
			},
			{
				pattern: /\{-[\s\S]*?(?:-\}|$)/,
				lookbehind: true,
				greedy: true
			},
		],

		'keyword': /\b(?:_(?=\s*:)|asm|const|do|else|elseif|elseifnot|forall|global|if|ifnot|impure|inline|inline_ref|method_id|repeat|return|until|while)\b/,
		'boolean': /\b(?:false|true)\b/,
		'builtin': /\b(?:_|builder|cell|cont|int|slice|tuple|var)\b/,

		'string': string,
		'number': number,
		'variable': identifier,

		'operator': /(<=>|>=|<=|!=|==|~>>=|~>>|\/%|\^%=|\^%|~%|\^\/=|\^\/|~\/=|~\/|\+=|-=|\*=|\/=|%=|<<=|>>=|\^>>=|\^>>|&=|>>|<<|\^=|\|=|\^|=|~|\/|%|-|\*|\+|>|<|&|\||:|\?)/,
		'punctuation': /[\.;\(\),\[\]~\{\}]/,
	};
}(Prism));
