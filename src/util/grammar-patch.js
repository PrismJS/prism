import { insertAfter, insertBefore } from './insert.js';
import { deepMerge } from './objects.js';

/**
 * Apply a patch to a grammar to modify it.
 * The patch and the grammar may be the same object.
 *
 * @param {Grammar} grammar
 * @param {Grammar} [patch=grammar]
 * @returns {Grammar}
 */
export function grammarPatch (grammar, patch = grammar) {
	if (patch.$insertBefore) {
		for (const key in patch.$insertBefore) {
			const tokens = patch.$insertBefore[key];

			if (key?.includes('/')) {
				// Deep key
				let path = key.split('/');
				const lastKey = path.pop();
				path = path.flatMap(key => [key, 'inside']); // add `inside` after each key
				// @ts-ignore
				const obj = path.reduce((acc, key) => acc?.[key], grammar);

				if (obj) {
					// @ts-ignore
					insertBefore(obj, lastKey, tokens);
				}
			}
			else if (tokens) {
				// @ts-ignore
				insertBefore(grammar, key, tokens);
			}
		}
		delete grammar.$insertBefore;
	}

	if (patch.$insertAfter) {
		for (const key in patch.$insertAfter) {
			const tokens = patch.$insertAfter[key];

			if (key?.includes('/')) {
				// Deep key
				let path = key.split('/');
				const lastKey = path.pop();
				path = path.flatMap(key => [key, 'inside']); // add `inside` after each key
				// @ts-ignore
				const obj = path.reduce((acc, key) => acc?.[key], grammar);

				if (obj) {
					// @ts-ignore
					insertAfter(obj, lastKey, tokens);
				}
			}
			else if (tokens) {
				// @ts-ignore
				insertAfter(grammar, key, tokens);
			}
		}
		delete grammar.$insertAfter;
	}

	if (patch.$delete) {
		// @ts-ignore
		for (const key of patch.$delete) {
			// TODO support deep keys
			delete grammar[key];
		}
		delete grammar.$delete;
	}

	if (patch.$merge) {
		for (const key in patch.$merge) {
			const tokens = patch.$merge[key];

			if (grammar[key]) {
				deepMerge(grammar[key], tokens);
			}
			else {
				grammar[key] = /** @type {GrammarTokens} */ (tokens);
			}
		}

		delete grammar.$merge;
	}

	return grammar;
}

/**
 * @typedef {import('../types.d.ts').Grammar} Grammar
 * @typedef {import('../types.d.ts').GrammarTokens} GrammarTokens
 */
