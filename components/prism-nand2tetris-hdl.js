/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['nand2tetris-hdl']) {
      return
    }
	Prism.languages['nand2tetris-hdl'] = {
		'comment': /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
		'keyword': /\b(?:BUILTIN|CHIP|CLOCKED|IN|OUT|PARTS)\b/,
		'boolean': /\b(?:false|true)\b/,
		'function': /\b[A-Za-z][A-Za-z0-9]*(?=\()/,
		'number': /\b\d+\b/,
		'operator': /=|\.\./,
		'punctuation': /[{}[\];(),:]/
	};
}