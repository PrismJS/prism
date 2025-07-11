import { insertAfter, insertBefore } from './insert';
import { deepMerge } from './objects';
import type { Grammar, GrammarTokens } from '../types';

/**
 * Apply a patch to a grammar to modify it.
 * The patch and the grammar may be the same object.
 *
 * @param grammar
 * @param patch
 * @returns
 */
export function grammarPatch (grammar: Grammar, patch: Grammar = grammar): Grammar {
	if (patch.$insertBefore) {
		for (const key in patch.$insertBefore) {
			const tokens = patch.$insertBefore[key];

			if (key?.includes('/')) {
				// Deep key
				let path = key.split('/');
				const lastKey = path.pop();
				path = path.flatMap(key => [key, 'inside']); // add `inside` after each key
				let obj = path.reduce((acc, key) => acc?.[key] as Grammar, grammar);

				if (obj) {
					insertBefore(obj, lastKey as string, tokens as GrammarTokens);
				}
			}
			else if (tokens) {
				insertBefore(grammar, key, tokens as GrammarTokens);
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
				let obj = path.reduce((acc, key) => acc?.[key] as Grammar, grammar);

				if (obj) {
					insertAfter(obj, lastKey as string, tokens as GrammarTokens);
				}
			}
			else if (tokens) {
				insertAfter(grammar, key, tokens as GrammarTokens);
			}
		}
		delete grammar.$insertAfter;
	}

	if (patch.$delete) {
		for (const key of patch.$delete) {
			// TODO support deep keys
			delete grammar[key as string];
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
				grammar[key] = tokens;
			}
		}

		delete grammar.$merge;
	}

	return grammar;
}
