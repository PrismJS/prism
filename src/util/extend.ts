import { betterAssign, deepClone } from './objects';
import type { Grammar, GrammarSpecial } from '../types';

/**
 * Creates a deep copy of the language with the given id and appends the given tokens.
 *
 * If a token in `reDef` also appears in the copied language, then the existing token in the copied language
 * will be overwritten at its original position.
 *
 * ## Best practices
 *
 * Since the position of overwriting tokens (token in `reDef` that overwrite tokens in the copied language)
 * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
 * understand the language definition because, normally, the order of tokens matters in Prism grammars.
 *
 * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
 * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
 *
 * @param base The grammar of the language to extend.
 * @param grammar The new tokens to append.
 * @returns The new language created.
 * @example
 * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
 *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
 *     // at its original position
 *     'comment': { ... },
 *     // CSS doesn't have a 'color' token, so this token will be appended
 *     'color': /\b(?:red|green|blue)\b/
 * });
 */
export function extend (base: Grammar, grammar: Grammar): Grammar {
	const lang = deepClone(base);

	for (const key in grammar) {
		if (typeof key !== 'string' || key.startsWith('$')) {
			// ignore special keys
			continue;
		}

		lang[key] = grammar[key];
	}

	if (grammar.$insertBefore) {
		lang.$insertBefore = betterAssign(lang.$insertBefore ?? {}, grammar.$insertBefore);
	}

	if (grammar.$insertAfter) {
		lang.$insertAfter = betterAssign(lang.$insertAfter ?? {}, grammar.$insertAfter);
	}

	if (grammar.$insert) {
		// Syntactic sugar for $insertBefore/$insertAfter
		for (let tokenName in grammar.$insert) {
			let def = grammar.$insert[tokenName] as Grammar;
			let { $before, $after, ...token } = def;
			let relToken = $before || $after;
			let all = $before ? '$insertBefore' : '$insertAfter';
			lang[all] ??= {};

			if (Array.isArray(relToken)) {
				// Insert in multiple places
				for (let t of relToken) {
					lang[all][t][tokenName] = token;
				}
			}
			else if (relToken) {
				(lang[all][relToken] ??= {})[tokenName] = token;
			}
			else {
				lang[tokenName] = token;
			}
		}
	}

	if (grammar.$delete) {
		if (lang.$delete) {
			// base also had $delete
			lang.$delete.push(...grammar.$delete);
		}
		else {
			lang.$delete = [...grammar.$delete];
		}
	}

	if (grammar.$merge) {
		lang.$merge = betterAssign(lang.$merge ?? {}, grammar.$merge);
	}

	return lang;
}
