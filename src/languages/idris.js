import haskell from './haskell.js';

/** @type {import('../types.d.ts').LanguageProto<'idris'>} */
export default {
	id: 'idris',
	base: haskell,
	alias: 'idr',
	grammar () {
		return {
			'comment': {
				pattern: /(?:(?:--|\|\|\|).*$|\{-[\s\S]*?-\})/m,
			},
			'string': {
				pattern: /"(?:[^\\"]|\\[\s\S])*"/,
				greedy: true,
				inside: {
					'interpolation': {
						pattern: /\\\{[^}]*\}/,
						inside: {
							'punctuation': /^\\\{|\}$/,
						},
					},
				},
			},
			'keyword':
				/\b(?:auto|autobind|case|class|codata|constructor|corecord|covering|data|default|do|dsl|else|export|failing|forall|if|implementation|implicit|import|impossible|in|infix|infixl|infixr|instance|interface|let|module|mutual|namespace|of|open|parameters|partial|postulate|prefix|private|proof|public|quoteGoal|record|rewrite|syntax|then|total|typebind|using|where|with)\b/,
			'builtin':
				/\b(?:Bool|Char|Double|IO|Int|Integer|List|Maybe|Nat|String|Type|Unit|Void)\b/,
			$insert: {
				'pragma': {
					$before: 'keyword',
					pattern: /%\w+/,
					alias: 'keyword',
				},
				'import-statement': {
					$before: 'keyword',
					pattern: /(^\s*import\s+)(?:[A-Z][\w']*)(?:\.[A-Z][\w']*)*/m,
					lookbehind: true,
					inside: {
						'punctuation': /\./,
					},
				},
			},
		};
	},
};
