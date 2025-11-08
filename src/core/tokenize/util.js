import singleton from '../prism.js';

/**
 * @this {Prism}
 * @param {Grammar | string | null | undefined} reference
 * @returns {Grammar | undefined}
 */
export function resolve (reference) {
	const prism = this ?? singleton;
	let ret = reference ?? undefined;

	if (typeof ret === 'string') {
		ret = prism.languageRegistry.getLanguage(ret)?.resolvedGrammar;
	}

	if (typeof ret === 'object' && ret.$rest) {
		const restGrammar = resolve.call(prism, ret.$rest) ?? {};
		if (typeof restGrammar === 'object') {
			ret = { ...ret, ...restGrammar };
		}

		delete ret.$rest;
	}

	return /** @type {Grammar | undefined} */ (ret);
}

/**
 * @import { Prism } from '../prism.js';
 * @import { Grammar, LanguageRegistry } from '../../types.d.ts';
 */
