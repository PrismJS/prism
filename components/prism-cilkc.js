import { loader as cLoader } from "./prism-c.js"

/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['cilkc']) {
      return
    }

    cLoader(Prism)

	Prism.languages.cilkc = Prism.languages.insertBefore('c', 'function', {
		'parallel-keyword': {
			pattern: /\bcilk_(?:for|reducer|s(?:cope|pawn|ync))\b/,
			alias: 'keyword'
		}
	});

	Prism.languages['cilk-c'] = Prism.languages['cilkc'];
}