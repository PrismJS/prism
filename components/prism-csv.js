/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['csv']) {
      return
    }
	// https://tools.ietf.org/html/rfc4180

	Prism.languages.csv = {
		'value': /[^\r\n,"]+|"(?:[^"]|"")*"(?!")/,
		'punctuation': /,/
	};
}