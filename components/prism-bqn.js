Prism.languages.bqn = {
	'shebang': {
		pattern: /^#![ \t]*\/.*/,
		alias: 'important',
		greedy: true
	},
	'comment': {
		pattern: /#.*/,
		greedy: true
	},
	'string-literal': {
		pattern: /"(?:[^"]|"")*"/,
		greedy: true,
		alias: 'string'
	},
	'character-literal': {
		pattern: /'.'/,
		greedy: true,
		alias: 'string'
	},
	'function': {
		pattern: /•[\w¯.∞π]+[\w¯.∞π]*/i
	},
	'dot-notation-on-brackets': {
		pattern: /\{(?=.*\}\.)|\}\./,
		alias: 'namespace'
	},
	'special-name': {
		pattern: /(?:𝕨|𝕩|𝕗|𝕘|𝕤|𝕣|𝕎|𝕏|𝔽|𝔾|𝕊|_𝕣_|_𝕣)/,
		alias: 'keyword'
	},
	'dot-notation-on-name': {
		pattern: /[A-Z_][\w¯∞π]*\./i,
		alias: 'namespace'
	},
	'word-number-scientific': {
		pattern: /\d+(?:\.\d+)?[e|E]¯?\d+/,
		alias: 'number'
	},
	'word-name': {
		pattern: /[A-Z_][\w¯∞π]*/i,
		alias: 'symbol'
	},
	'word-number': {
		pattern: /[¯∞π]?(?:\d*\.?\b\d+(?:e[+¯]?\d+)?|¯|∞|π)(?:j¯?(?:(?:\d+(?:\.\d+)?|\.\d+)(?:e[+¯]?\d+)?|¯|∞|π))?/i,
		alias: 'number'
	},
	'null-literal': {
		pattern: /@/,
		alias: 'string'
	},
	'primitive-functions': {
		pattern: /[-+×÷⋆√⌊⌈|¬∧∨<>≠=≤≥≡≢⊣⊢⥊∾≍⋈↑↓↕«»⌽⍉/⍋⍒⊏⊑⊐⊒∊⍷⊔!]/,
		alias: 'operator'
	},
	'primitive-1-operators': {
		pattern: /[`˜˘¨⁼⌜´˝˙]/,
		alias: 'operator'
	},
	'primitive-2-operators': {
		pattern: /[∘⊸⟜○⌾⎉⚇⍟⊘◶⎊]/,
		alias: 'operator'
	},
	'punctuation': /[←⇐↩(){}⟨⟩[\]‿·⋄,.;:?]/
};
