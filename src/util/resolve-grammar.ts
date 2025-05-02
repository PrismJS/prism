import { insertBefore } from './insert-before';
import { deepMerge } from './objects';
import type { Grammar, GrammarTokens } from '../types';

export function resolveGrammar (grammar: Grammar) {
	if (grammar.$insertBefore) {
		for (const key in grammar.$insertBefore) {
			const tokens = grammar.$insertBefore[key];
			if (tokens) {
				insertBefore(grammar, key, tokens as GrammarTokens);
			}
		}
		delete grammar.$insertBefore;
	}

	if (grammar.$delete) {
		for (const key of grammar.$delete) {
			// TODO support deep keys
			delete grammar[key as string];
		}
		delete grammar.$delete;
	}

	if (grammar.$merge) {
		for (const key in grammar.$merge) {
			const tokens = grammar.$merge[key];

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
