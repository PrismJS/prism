Prism.languages.apl = {
	'comment': /(⍝|#[! ]).*$/gm,
	'string': /'[^'\r\n]*'/g,
	'number': /¯?(\d*\.?\d+(e[+¯]?\d+)?|¯|∞)(j¯?(\d*\.?\d+(e[\+¯]?\d+)?|¯|∞))?/gi,
	'statement': /:[A-Z][a-z]+/g,
	'systemfunction': /⎕[A-Z]+/ig,
	'constant': /([⍬⌾#⎕⍞])/g,
	'function': /[\+\-×÷⌈⌊∣\|⍳\?*⍟○!⌹<≤=>≥≠≡≢∊⍷∪∩~∨∧⍱⍲⍴,⍪⌽⊖⍉↑↓⊂⊃⌷⍋⍒⊤⊥⍕⍎⊣⊢⍁⍂≈⍯↗¤→]/g,
	'monadic-operator': /[\\\/⌿⍀¨⍨⌶&∥]/g,
	'dyadic-operator': /[\.⍣⍠⍤∘⌸]/g,
	'assignment': /←/,
	'punctuation': /[\[;\]\(\)◇⋄]/g,
	'dfn': /[\{\}⍺⍵⍶⍹∇⍫:]/g
};
