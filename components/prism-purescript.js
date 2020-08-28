Prism.languages.purescript = Prism.languages.extend('haskell', {
	'keyword': /\b(?:ado|case|class|data|derive|do|else|forall|if|in|infixl|infixr|instance|let|module|newtype|of|primitive|then|type|where)\b/,

	'import_statement': {
		// The imported or hidden names are not included in this import
		// statement. This is because we want to highlight those exactly like
		// we do for the names in the program.
		pattern: /((?:\r?\n|\r|^)\s*)import\s+(?:[A-Z][\w']*)(?:\.[A-Z][\w']*)*(?:\s+as\s+(?:[A-Z][_a-zA-Z0-9']*)(?:\.[A-Z][\w']*)*)?(?:\s+hiding\b)?/m,
		lookbehind: true,
		inside: {
			'keyword': /\b(?:import|as|hiding)\b/
		}
	},

	// These are builtin functions only. Constructors are highlighted later as a constant.
	'builtin': /\b(?:when|unless|liftA1|apply|bind|discard|join|ifM|identity|whenM|unlessM|liftM1|ap|compose|otherwise|top|bottom|recip|eq|notEq|degree|div|mod|lcm|gcd|flip|const|map|void|flap|conj|disj|not|mempty|compare|min|max|comparing|clamp|between|sub|negate|append|add|zero|mul|one|show|unit|absurd)\b/,
});

Prism.languages.purs = Prism.languages.purescript;
