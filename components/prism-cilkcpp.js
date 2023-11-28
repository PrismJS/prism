/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
import { loader as cppLoader } from "./prism-cpp.js"
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['cilkcpp']) {
      return
    }

    cppLoader(Prism)

	Prism.languages.cilkcpp = Prism.languages.insertBefore('cpp', 'function', {
		'parallel-keyword': {
			pattern: /\bcilk_(?:for|reducer|s(?:cope|pawn|ync))\b/,
			alias: 'keyword'
		}
	});

	Prism.languages['cilk-cpp'] = Prism.languages['cilkcpp'];
	Prism.languages['cilk'] = Prism.languages['cilkcpp'];
}