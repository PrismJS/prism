import { camelToKebabCase } from '../../shared/util';
import singleton from '../prism';
import type { Grammar, Prism } from '../../types';

export function resolve (
	this: Prism,
	reference: Grammar | string | null | undefined | Function
): Grammar | undefined | Function {
	let prism = this ?? singleton;
	let ret = reference ?? undefined;

	if (typeof ret === 'string') {
		ret = prism.languageRegistry.getLanguage(ret)?.resolvedGrammar;
	}

	if (typeof ret === 'function' && ret.length === 0) {
		// Function with no arguments, resolve eagerly
		ret = ret.call(prism);
	}

	if (typeof ret === 'object' && ret.$rest) {
		let restGrammar = resolve.call(prism, ret.$rest) ?? {};
		delete ret.$rest;

		if (typeof restGrammar === 'object') {
			ret = { ...ret, ...restGrammar };
		}
	}

	return ret as Grammar | undefined | Function;
}

export function tokenizeByNamedGroups (match: RegExpExecArray): ({ type; content } | string)[] {
	let str = match[0];
	let result: ({ type; content } | string)[] = [];
	let i = 0;

	let entries = Object.entries(match.indices?.groups || {})
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

		let content = str.slice(start, end);
		type = camelToKebabCase(type);
		result.push({ type, content });
		i = end;
	}

	if (i < str.length) {
		result.push(str.slice(i));
	}

	return result;
}
