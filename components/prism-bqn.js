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
		pattern: /"(?:\\[\s\S]|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
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
		pattern: /[𝕨𝕩𝕗𝕘𝕤𝕣𝕎𝕏𝔽𝔾𝕊]|_𝕣[_]?/u,
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
