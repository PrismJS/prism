import { camelToKebabCase } from '../../shared/util.js';
import singleton from '../prism.js';

/**
 * @this {Prism}
 * @param {Grammar | string | Function | null | undefined} reference
 * @returns {Grammar | Function | undefined}
 */
export function resolve (reference) {
	const prism = this ?? singleton;
	let ret = reference ?? undefined;

	if (typeof ret === 'string') {
		ret = prism.languageRegistry.getLanguage(ret)?.resolvedGrammar;
	}

	if (typeof ret === 'function' && ret.length === 0) {
		// Function with no arguments, resolve eagerly
		ret = ret.call(prism);
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
 *
 * @param {RegExpExecArray} match
 * @returns {({type: string, content: string} | string)[]}
 */
export function tokenizeByNamedGroups (match) {
	const str = match[0];
	const result = [];
	let i = 0;

	const entries = Object.entries(match.indices?.groups || {})
		.map(([type, [start, end]]) => ({
			type,
			start: start - match.index,
			end: end - match.index,
		}))
		.sort((a, b) => a.start - b.start);

	for (let { type, start, end } of entries) {
		if (start > i) {
			result.push(str.slice(i, start));
		}

		const content = str.slice(start, end);
		type = camelToKebabCase(type);
		result.push({ type, content });
		i = end;
	}

	if (i < str.length) {
		result.push(str.slice(i));
	}

	return result;
}

/**
 * @import { Prism } from '../prism.js';
 * @import { Grammar, LanguageRegistry } from '../../types.d.ts';
 */
