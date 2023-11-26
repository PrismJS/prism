import { Prism as OGPrism } from "./prism-core.js"
import { loader as markupLoader } from "./components/prism-markup.js"
import { loader as cssLoader } from "./components/prism-css.js"
import { loader as clikeLoader } from "./components/prism-clike.js"
import { loader as javascriptLoader } from "./components/prism-javascript.js"
import { Plugin as FileHighlightPlugin } from "./plugins/file-highlight/prism-file-highlight.js"

class Prism extends OGPrism {
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

export { Prism }