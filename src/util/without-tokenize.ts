import type { Grammar } from '../types';

export function withoutTokenize (grammar: Grammar): Grammar {
	if (!grammar.$tokenize) {
		return grammar;
	}

	const copy = { ...grammar };
	delete copy.$tokenize;
	return copy;
}
