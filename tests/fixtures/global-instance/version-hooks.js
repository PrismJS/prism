/** @type {string} */
let version;

/** @param {string} data */
export function initialize (data) {
	version = data;
}

/**
 * Fills in the version placeholder of `src/version.js`, as the build does.
 *
 * @param {string} url
 * @param {object} context
 * @param {Function} next
 */
export async function load (url, context, next) {
	let result = await next(url, context);

	if (new URL(url).pathname.endsWith('/src/version.js')) {
		let source = String(result.source).replace(/\/\*\s*version_placeholder\[\s*\*\/[\s\S]*?\/\*\s*\]\s*\*\//, JSON.stringify(version));
		result = { ...result, source };
	}

	return result;
}
