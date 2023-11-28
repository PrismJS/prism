import { Prism as OGPrism } from "./prism-core.js"
import { loader as markupLoader } from "./components/prism-markup.js"
import { loader as cssLoader } from "./components/prism-css.js"
import { loader as clikeLoader } from "./components/prism-clike.js"
import { loader as javascriptLoader } from "./components/prism-javascript.js"
import { Plugin as FileHighlightPlugin } from "./plugins/file-highlight/prism-file-highlight.js"
export {
	environment,
	Token,
} from "./prism-core.js"

/**
 * @typedef {import("./prism-core.js").GrammarToken} GrammarToken
 * @typedef {import("./prism-core.js").Grammar} Grammar
 * @typedef {import("./prism-core.js").TokenStream} TokenStream
 * @typedef {import("./prism-core.js").HookCallback} HookCallback
 * @typedef {import("./prism-core.js").PrismOptions} PrismOptions
 * @typedef {import("./prism-core.js").HighlightCallback} HighlightCallback
 * @typedef {import("./prism-core.js").LoaderOptions} LoaderOptions
 */

/**
 * The main entrypoint class
 */
export class Prism extends OGPrism {
	/**
	 * @param {ConstructorParameters<typeof OGPrism>} args
	 */
	constructor (...args) {
		super(...args)

		// Load initial plugins / languages
		markupLoader(this)
		cssLoader(this)
		clikeLoader(this)
		javascriptLoader(this)
		FileHighlightPlugin(this)
	}
}
