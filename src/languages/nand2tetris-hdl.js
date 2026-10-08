import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'nand2tetris-hdl'>} */
const Self = {
	id: 'nand2tetris-hdl',
	grammar: {
		'comment': /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
		'keyword': /\b(?:BUILTIN|CHIP|CLOCKED|IN|OUT|PARTS)\b/,
		'boolean': /\b(?:false|true)\b/,
		'function': /\b[A-Za-z][A-Za-z0-9]*(?=\()/,
		'number': /\b\d+\b/,
		'operator': /=|\.\./,
		'punctuation': /[{}[\];(),:]/,
	},
};

export default Self;

registry.add(Self);
