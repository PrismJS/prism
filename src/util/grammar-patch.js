import { insertAfter, insertBefore } from './insert.js';
import { isObject, isPlainObject } from './objects.js';

/**
 * Merges a token definition or patch into an existing token definition.
 *
 * @param {any} target
 * @param {any} source
 * @returns {any}
 */
function mergeToken (target, source) {
	if (Array.isArray(target)) {
		if (isPlainObject(source)) {
			for (let i = 0; i < target.length; i++) {
				target[i] = mergeToken(target[i], source);
			}
			return target;
		}
	}

	if (isPlainObject(source) && (target instanceof RegExp || isObject(target, 'RegExp'))) {
		target = { pattern: target };
	}

	if (isPlainObject(target) && isPlainObject(source)) {
		for (const key in source) {
			target[key] = mergeToken(target[key], source[key]);
		}
		return target;
	}

	return source ?? target;
}

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

				if (isPlainObject(obj) && tokens) {
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

				if (isPlainObject(obj) && tokens) {
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

			if (grammar[key] !== undefined) {
				// @ts-ignore
				grammar[key] = mergeToken(grammar[key], tokens);
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
