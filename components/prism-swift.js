Prism.languages.swift = Prism.languages.extend('clike', {
	'keyword': /\b(Array|as|associativity|break|case|Character|class|continue|deinit|default|Dictionary|didSet|do|Double|dynamicType|else|enum|fallthrough|Float|for|func|IBAction|if|import|in|infix|init|inout|is|left|let|mutating|new|none|nonmutating|operator|override|postfix|precedence|prefix|protocol|return|right|self|Self|set|String|struct|subscript|super|switch|Type|typealias|unowned|unowned(safe)|unowned(unsafe)|weak|where|while|willSet|var)\b/g,
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g
});
