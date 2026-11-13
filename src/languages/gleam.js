Prism.languages.gleam = {
	// doc comments first so /// isn't matched as //
	'comment': [
		/\/\/{3,4}.*/,
		/\/\/.*/
	],

	'string': {
		pattern: /"(?:\\.|[^"\\])*"/,
		greedy: true
	},

	'attribute': {
		pattern: /@\w+/,
		alias: 'annotation'
	},

	'keyword': /\b(?:as|assert|case|const|echo|else|fn|if|import|let|opaque|panic|pub|todo|type|use)\b/,

	'boolean': /\b(?:True|False)\b/,

	// keep before class-name so builtins are highlighted correctly
	'builtin': /\b(?:Int|Float|String|Bool|List|Result|Option|Nil)\b/,

	// heuristic: matches types and constructors (no AST available)
	'class-name': /\b[A-Z]\w*\b/,

	'number': /\b(?:0b[01][01_]*|0o[0-7][0-7_]*|0x[\da-fA-F][\da-fA-F_]*|\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d[\d_]*)?)\b/,

	// best-effort: identifier followed by (
	'function': /\b[a-z_]\w*(?=\s*\()/,

	'operator': /\|>|<>|->|<-|\.\.|\+\.|-\.|\*\.|\/\.|==|!=|<=|>=|&&|\|\||[+\-*\/%<>=!]/,

	'punctuation': /[{}[\](),.:;#]/
};