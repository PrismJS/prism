import { loader as vbnetLoader } from "./prism-vbnet.js"
import { loader as t4TemplatingLoader } from "./prism-t4-templating.js"

export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['t4-vb']) {
      return
    }

    vbnetLoader(Prism)
    t4TemplatingLoader(Prism)

	Prism.languages['t4-vb'] = Prism.languages['t4-templating'].createT4('vbnet');
}