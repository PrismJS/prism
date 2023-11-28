/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
import { loader as schemeLoader } from "./prism-scheme.js"

export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['racket']) {
      return
    }
	if (!Prism.languages.scheme) {
		schemeLoader(Prism)
	}
	Prism.languages.racket = Prism.languages.extend('scheme', {
		'lambda-parameter': {
			// the racket lambda syntax is a lot more complex, so we won't even attempt to capture it.
			// this will just prevent false positives of the `function` pattern
			pattern: /([(\[]lambda\s+[(\[])[^()\[\]'\s]+/,
			lookbehind: true
		}
	});

	Prism.languages.insertBefore('racket', 'string', {
		'lang': {
			pattern: /^#lang.+/m,
			greedy: true,
			alias: 'keyword'
		}
	});

	Prism.languages.rkt = Prism.languages.racket;
}