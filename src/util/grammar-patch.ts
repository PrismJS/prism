import { insertBefore } from './insert-before';
import { deepMerge } from './objects';
import type { Grammar, GrammarTokens } from '../types';

export function grammarPatch (grammar: Grammar, patch: Grammar = grammar): Grammar {
	if (patch.$insertBefore) {
		for (const key in patch.$insertBefore) {
			const tokens = patch.$insertBefore[key];
			if (tokens) {
				insertBefore(grammar, key, tokens as GrammarTokens);
			}
		}
		delete grammar.$insertBefore;
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
