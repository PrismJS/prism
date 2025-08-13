/** @type {import('../types.d.ts').LanguageProto<'apl'>} */
export default {
	id: 'apl',
	grammar: {
		'comment': /(?:⍝|#[! ]).*$/m,
		'string': {
			pattern: /'(?:[^'\r\n]|'')*'/,
			greedy: true,
		},
		'number':
			/¯?(?:\d*\.?\b\d+(?:e[+¯]?\d+)?|¯|∞)(?:j¯?(?:(?:\d+(?:\.\d+)?|\.\d+)(?:e[+¯]?\d+)?|¯|∞))?/i,
		'statement': /:[A-Z][a-z][A-Za-z]*\b/,
		'system-function': {
			pattern: /⎕[A-Z]+/i,
			alias: 'function',
		},
		'constant': /[⍬⌾#⎕⍞]/,
		'function': /[-+×÷⌈⌊∣|⍳⍸?*⍟○!⌹<≤=>≥≠≡≢∊⍷∪∩~∨∧⍱⍲⍴,⍪⌽⊖⍉↑↓⊂⊃⊆⊇⌷⍋⍒⊤⊥⍕⍎⊣⊢⍁⍂≈⍯↗¤→]/,
		'monadic-operator': {
			pattern: /[\\\/⌿⍀¨⍨⌶&∥]/,
			alias: 'operator',
		},
		'dyadic-operator': {
			pattern: /[.⍣⍠⍤∘⌸@⌺⍥]/,
			alias: 'operator',
		},
		'assignment': {
			pattern: /←/,
			alias: 'keyword',
		},
		'punctuation': /[\[;\]()◇⋄]/,
		'dfn': {
			pattern: /[{}⍺⍵⍶⍹∇⍫:]/,
			alias: 'builtin',
		},
	},
};
