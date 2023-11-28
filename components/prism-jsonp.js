/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
import { loader as jsonLoader } from "./prism-json.js"

export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['jsonp']) {
      return
    }
	if (!Prism.languages.json) {
		jsonLoader(Prism)
	}

	Prism.languages.jsonp = Prism.languages.extend('json', {
		'punctuation': /[{}[\]();,.]/
	});

	Prism.languages.insertBefore('jsonp', 'punctuation', {
		'function': /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*\()/
	});
}