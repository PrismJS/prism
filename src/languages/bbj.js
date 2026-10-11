// A name followed by one of these is a different name: `tim$` is not `tim`, `rem15` is not `rem`
const notPartOfName = /(?![\w!$%@])/.source;
const modifier = /(?:abstract|private|protected|public|static)/.source;
// `Foo`, `java.util.HashMap`, `JPanel@` (a client object class), `BBjString[]`
const type = /[a-z_][\w.]*@?(?:\[\])*/.source;

/**
 * Replaces each `<MOD>` in the pattern with the modifiers of a class member, and each `<TYPE>`
 * with a type.
 *
 * @param {RegExp} pattern
 * @returns {RegExp}
 */
function expand (pattern) {
	return RegExp(
		pattern.source.replace(/<MOD>/g, () => modifier).replace(/<TYPE>/g, () => type),
		'i'
	);
}

/** @type {import('../types.d.ts').LanguageProto<'bbj'>} */
export default {
	id: 'bbj',
	grammar: {
		'comment': {
			pattern: RegExp(/(^|[^\w!$%@#])rem/.source + notPartOfName + /.*/.source, 'im'),
			lookbehind: true,
			greedy: true,
		},
		'string': {
			// A quote inside a string is written twice. A string goes on over lines that start with
			// `:`, which continues the line before.
			pattern: /"(?:""|[^\n\r"]|(?:\r\n?|\n)[ \t]*:)*"/,
			greedy: true,
		},
		'hex-string': {
			pattern: /(^|[^\w$])\$[\da-f]*\$/im,
			lookbehind: true,
			greedy: true,
			alias: 'string',
		},
		// 'CS', 'LF', 'BOX'(10,12,4,4)
		'mnemonic': {
			pattern: /'\w*'/,
			greedy: true,
			alias: 'symbol',
		},
		'line-number': {
			pattern: /(^[ \t]*)\d+(?=[ \t])/m,
			lookbehind: true,
			greedy: true,
			alias: 'label',
		},
		'label': [
			{
				// A label declaration starts its line: `done:`, `0030 done:`
				pattern: /(^[ \t]*(?:\d+[ \t]+)?)[a-z_]\w*:(?!:)/im,
				lookbehind: true,
				greedy: true,
				inside: {
					'punctuation': /:$/,
				},
			},
			{
				pattern:
					/(\b(?:exitto|gosub|goto|retry|seterr|setesc)[ \t]+)[a-z_]\w*(?:[ \t]*,[ \t]*[a-z_]\w*)*/i,
				lookbehind: true,
				inside: {
					'punctuation': /,/,
				},
			},
			{
				// ERR=, DOM=, END=, IOL= options of I/O verbs
				pattern: /([(,][ \t]*(?:dom|end|err|iol)[ \t]*=[ \t]*)[a-z_]\w*/i,
				lookbehind: true,
			},
		],
		'boolean': /\bBBjAPI\.(?:FALSE|TRUE)\b/i,
		'class-name': [
			{
				pattern: expand(
					/(\b(?:class|interface)[ \t]+(?:<MOD>[ \t]+)*)(?!<MOD>\b)[a-z_]\w*/
				),
				lookbehind: true,
			},
			{
				pattern: expand(
					/(\b(?:declare(?:[ \t]+auto)?|extends|implements|new|use)[ \t]+)<TYPE>(?:[ \t]*,[ \t]*<TYPE>)*/
				),
				lookbehind: true,
				inside: {
					'punctuation': /[.,[\]]/,
				},
			},
			{
				pattern: expand(/(\bfield[ \t]+(?:<MOD>[ \t]+)*)(?!<MOD>\b)<TYPE>/),
				lookbehind: true,
				inside: {
					'punctuation': /[.[\]]/,
				},
			},
			{
				// Return type of a method; `void` is a keyword, a constructor has no return type
				pattern: expand(
					/(\bmethod[ \t]+(?:<MOD>[ \t]+)*)(?!(?:<MOD>|void)\b)<TYPE>(?=[ \t]+[a-z_])/
				),
				lookbehind: true,
				inside: {
					'punctuation': /[.[\]]/,
				},
			},
			{
				// Parameter type: `(BBjNumber n%, java.lang.String s!)`
				pattern: expand(
					/([(,][ \t]*)(?!(?:and|not|or|xor)\b)<TYPE>(?=[ \t]+[a-z_]\w*[!$%]?[ \t]*[),])/
				),
				lookbehind: true,
				inside: {
					'punctuation': /[.[\]]/,
				},
			},
			{
				// A class loaded from a file: `use ::lib/util.bbj::Util`
				pattern: /(::[^\n\r]*?::)[a-z_]\w*/i,
				lookbehind: true,
			},
			{
				// A client object class: `java.lang.System@.getProperty(…)`
				pattern: /\b[a-z_][\w.]*@/i,
				inside: {
					'punctuation': /\./,
				},
			},
			/\bBBj[A-Z]\w*/,
		],
		'file-path': {
			pattern: /::[^\n\r]*?::/,
			greedy: true,
			alias: 'string',
		},
		'keyword': [
			/#(?:super|this)!/i,
			// `?` is short for PRINT
			/\?/,
			RegExp(
				// IND, KEY and LEN are also functions: `len(x$)`
				/\b(?!(?:ind|key|len)\()(?:abstract|addr|all|argc|auto|background|begin|break|bye|call|callback|case|cast|chanopt|chdir|chn|class|classend|clear|clearp|clipclear|clipfromfile|clipfromstr|cliplock|cliptofile|clipunlock|close|continue|ctl|data|day|declare|def|default|delete|denum|dim|direct|dom|dread|drop|dsz|dump|else|end|endif|endtrace|enter|erase|err|escape|except|execute|exit|exitto|extends|extract|extractrecord|fi|field|file|fileopt|find|findrecord|floatingpoint|fnend|fnerr|for|from|fulltext|gosub|goto|if|implements|ind|indexed|initfile|input|inpute|inputn|inputrecord|interface|interfaceend|iol|iolist|key|lcheckin|len|let|limit|list|load|lock|method|methodend|methodret|mkdir|mkeyed|mode|new|next|on|open|opts|pfx|precision|prefix|print|printrecord|private|process_events|protected|psz|public|read|readrecord|read_resource|record|redim|release|remove|remove_callback|rename|repeat|resclose|reset|restore|retry|return|rev|rmdir|run|save|savep|select|serial|setday|setdrive|seterr|setesc|setopts|setterm|settime|settrace|sort|sortby|sqlchn|sqlclose|sqlcommit|sqlexec|sqlopen|sqlprep|sqlrollback|sqlset|sqlunt|ssn|start|static|step|stop|string|swend|switch|sys|table|then|throw|tim|to|unlock|unt|until|updatelic|use|vkeyed|void|wait|wend|where|while|write|writerecord|xcall|xfile|xkeyed)/
					.source + notPartOfName,
				'i'
			),
		],
		// A field of the current object: `#name$`
		'property': /#[a-z_]\w*[!$%]?(?![\w(])/i,
		'function': [
			// Cursor position in PRINT: `@(10,5)`
			/@(?=\()/,
			// Only user-defined functions have a suffix: `FNADD$(x$)`. Elsewhere a suffix before `(` is
			// a variable: `name$(1,3)` is a substring of name$.
			/\bfn\w*[$%]?(?=\()/i,
			/\b[a-z_]\w*(?=\()/i,
		],
		// The suffix gives the type: $ string, % integer, ! object
		'variable': /\b[a-z_]\w*[!$%]/i,
		'number': /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:E[+-]?\d+)?/i,
		'operator': /<[=>]?|>=?|[-+*\/^=&]|\b(?:and|not|or|xor)\b/i,
		'punctuation': /[.,;:()[\]]/,
	},
};
