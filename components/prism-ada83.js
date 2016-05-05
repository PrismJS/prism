/**
 * Ada83
 * Written Luke A. Guest
    'string': /(\'|\")(\\?.)*?\1/,
 */
Prism.languages.ada83 = {
    'comment': /--.*/,
    'string': /"(""|[^\"\r\f\n])*?"/i,
    'number': [
	{
	    pattern: /\b[0-9](_?[0-9])*#[0-9A-F](_?[0-9A-F])*(\.[0-9A-F](_?[0-9A-F])*)?#(([eE][+]?[0-9](_?[0-9])*)|([eE][+]?[0-9](_?[0-9])*))?/i
	},
	{
	    pattern: /\b[0-9](_?[0-9])*(\.[0-9](_?[0-9])*)?(([eE][+]?[0-9](_?[0-9])*)|([eE]-[0-9](_?[0-9])*))?\b/
	}
    ],
    'attribute': /\b\'\w+/i,
    'keyword': /\b(abort|abs|accept|access|all|and|array|at|begin|body|case|constant|declare|delay|delta|digits|do|else|new|return|elsif|end|entry|exception|exit|for|function|generic|goto|if|in|is|limited|loop|mod|not|null|of|others|out|package|pragma|private|procedure|raise|range|record|rem|renames|reverse|select|separate|subtype|task|terminate|then|type|use|when|while|with|xor)\b/i,
    'boolean': /\b(true|false)\b/i,
    'operator': /<>|=>|&|:=|<=|>=|<|>/i,
    'punctuation': /\.(\.?)|[,;():]/,
    'char': /'.'/,
    'variable': /\b[a-zA-Z](_|[a-zA-Z0-9])*\b/i
};
