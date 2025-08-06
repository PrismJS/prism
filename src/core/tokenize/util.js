/**
 * @param {Registry} components
 * @param {Grammar | string | null | undefined} reference
 * @returns {Grammar | undefined}
 */
export function resolve (components, reference) {
	if (reference) {
		if (typeof reference === 'string') {
			return components.getLanguage(reference);
		}
		return reference;
	}
	return undefined;
}

/**
 * @typedef {import('../../types.d.ts').Grammar} Grammar
 */

/**
 * @typedef {import('../registry.js').Registry} Registry
 */
