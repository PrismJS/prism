/**
 * Utilities for working with compound language ids of the form `outer:inner`.
 *
 * A compound id names a meta-language (`outer`) together with the language it embeds or
 * produces (`inner`). The inner part may itself be a compound id, e.g. `diff:django:css`.
 */

/**
 * Splits a language id at its first `:`.
 *
 * `splitLanguageId('diff:django:css')` returns `['diff', 'django:css']`;
 * `splitLanguageId('css')` returns `['css', undefined]`.
 *
 * @param {string} id
 * @returns {[outer: string, inner: string | undefined]}
 */
export function splitLanguageId (id) {
	const index = id.indexOf(':');
	if (index === -1) {
		return [id, undefined];
	}
	return [id.slice(0, index), id.slice(index + 1)];
}

/**
 * Returns all parts of a (possibly compound) language id.
 *
 * `languageIdParts('diff:django:css')` returns `['diff', 'django', 'css']`.
 *
 * @param {string} id
 * @returns {string[]}
 */
export function languageIdParts (id) {
	return id.split(':');
}
