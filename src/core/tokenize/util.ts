import type { Grammar, GrammarToken, GrammarTokens, RegExpLike } from '../../types';
import type LanguageRegistry from '../classes/language-registry';

export function resolve (
	languageRegistry: LanguageRegistry,
	reference: Grammar | string | null | undefined
): Grammar | undefined {
	if (reference) {
		if (typeof reference === 'string') {
			return languageRegistry.getLanguage(reference)?.grammar;
		}
		return reference;
	}
	return undefined;
}
