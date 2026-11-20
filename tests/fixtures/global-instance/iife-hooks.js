/**
 * Gives every module the IIFE copy imports its own `?iife` copy, so the IIFE copy shares no module with the module build.
 *
 * @param {string} specifier
 * @param {{ parentURL?: string }} context
 * @param {Function} next
 */
export async function resolve (specifier, context, next) {
	let result = await next(specifier, context);

	if (context.parentURL?.endsWith('?iife') && result.url.startsWith('file:')) {
		result = { ...result, url: result.url + '?iife' };
	}

	return result;
}
