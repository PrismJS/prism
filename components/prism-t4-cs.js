import { loader as csharpLoader } from "./prism-csharp.js"
import { loader as t4TemplatingLoader } from "./prism-t4-templating.js"

export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['t4-cs']) {
      return
    }

	csharpLoader(Prism)
    t4TemplatingLoader(Prism)

	Prism.languages.t4 = Prism.languages['t4-cs'] = Prism.languages['t4-templating'].createT4('csharp');
}