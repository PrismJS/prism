Prism.languages['nand2tetris-hdl'] = {
	'comment': /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
	'keyword': /\b(?:CHIP|IN|OUT|PARTS|BUILTIN|CLOCKED)\b/,
	'boolean': /\b(?:true|false)\b/,
	'number': /\b\d+\b/,
	'operator': /=|\.\./,
	'punctuation': /[{}[\];(),:]/
};
