// Reference: https://github.com/leanprover/vscode-lean4
// TODO: Consider operators and numbers in the middle of other strings
// TODO: String interpolation

(function (Prism) {
	Prism.languages.lean = {
		// OK
		'number': [
			/\b0b[01]+\b/i, // Binary
			/\b0o[0-7]+\b/i, // Octal
			/\b0x[0-9a-f]+\b/i, // Hexadecimal
			/-?[0-9]+\.?[0-9]*(e[-+]?[0-9]+)?\b/i // Regular / Scientific notation
		],

		// OK
		'comment': [
			/\/--[^-\/]*-\//, // Doc comment
			/\/-![^-\/]*-\//, // Mod doc comment
			/\/-[^-\/]*-\//, // Block comment
			// OBS: We left single-line for last to give priority to /-- -/
			/--.*$/m // Single-line comment
		],

		'keyword': [
			/\b(?:theorem|show|have|from|suffices|nomatch|def|class|structure|instance|set_option|initialize|builtin_initialize|example|inductive|coinductive|axiom|constant|universe|universes|variable|variables|import|open|export|theory|prelude|renaming|hiding|exposing|do|by|let|extends|mutual|mut|where|rec|syntax|macro_rules|macro|deriving|fun|section|namespace|end|infix|infixl|infixr|postfix|prefix|notation|abbrev|if|then|else|calc|match|with|for|in|unless|try|catch|finally|return|continue|break|global|local|scoped|partial|unsafe|private|protected|noncomputable)\b/,
			/#(print|eval|reduce|check_failure|check)/
		],

		'function-definition': {
			pattern: /(\b(?:inductive|coinductive|structure|theorem|axiom|abbrev|lemma|def|instance|class|constant)\s+)\w+/,
			lookbehind: true,
			alias: 'function'
		},

		'decorator': {
			pattern: /@\[[^\]\n]*\]/,
			alias: 'keyword'
		},

		'punctuation' : /[()\[\]{},:]/,

		'operator' : /(\+|\*|-|\/|:=|>>>|<<<|\^\^\^|&&&|\|\|\||\+\+|\^|%|~~~|<|<=|>|>=|==|=)/,

		'boolean' : /\b(true|false)\b/,

		'important': /\b(sorry|admit)\b/,

		'string': [
		    /"[^"]*"/,
		    /'[^']*'/
		],

		'quotation': {
			pattern: /`[^\s]*/,
			alias: 'symbol'
		}
	};
}(Prism));