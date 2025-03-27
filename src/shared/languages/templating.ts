import { getTextContent } from '../../core/token';
import { withoutTokenize } from '../language-util';
import type { Prism } from '../../core';
import type { Registry } from '../../core/registry';
import type { Token, TokenStream } from '../../core/token';
import type { Grammar } from '../../types';
import type { tokenize } from '../symbols';

const placeholderPattern = /___PH\d+___/;

function getPlaceholder (id: number): string {
	return `___PH${id}___`;
}

type TokenStack = [number, Token][];

function buildPlaceholders (
	code: string,
	grammar: Grammar | undefined,
	Prism: Prism
): { hostCode: string; tokenStack: TokenStack } {
	if (!grammar) {
		return { hostCode: code, tokenStack: [] };
	}

	const templateTokens = Prism.tokenize(code, grammar);
	const hasPlaceholderLike = placeholderPattern.test(code);

	let hostCode = '';
	const tokenStack: TokenStack = [];
	let id = 0;
	for (const token of templateTokens) {
		if (typeof token === 'string') {
			hostCode += token;
		}
		else if (token.type.startsWith('ignore')) {
			hostCode += getTextContent(token.content);
		}
		else {
			if (hasPlaceholderLike) {
				while (code.includes(getPlaceholder(id))) {
					id++;
				}
			}

			tokenStack.push([id, token]);
			hostCode += getPlaceholder(id);
			id++;
		}
	}

	return { hostCode, tokenStack };
}

function insertIntoHostToken (hostTokens: TokenStream, tokenStack: TokenStack) {
	let j = 0;

	const walkTokens = (tokens: TokenStream) => {
		for (let i = 0; i < tokens.length; i++) {
			// all placeholders are replaced already
			if (j >= tokenStack.length) {
				break;
			}

			const token = tokens[i];
			if (typeof token === 'string' || typeof token.content === 'string') {
				const [id, t] = tokenStack[j];
				const s = typeof token === 'string' ? token : (token.content as string);
				const placeholder = getPlaceholder(id);

				const index = s.indexOf(placeholder);
				if (index > -1) {
					++j;

					const before = s.substring(0, index);
					const middle = t;
					const after = s.substring(index + placeholder.length);

					const replacement = [];
					if (before) {
						replacement.push(before);
					}
					replacement.push(middle);
					if (after) {
						replacement.push(...walkTokens([after]));
					}

					if (typeof token === 'string') {
						tokens.splice(i, 1, ...replacement);
					}
					else {
						token.content = replacement;
					}
				}
			}
			else {
				walkTokens(token.content);
			}
		}

		return tokens;
	};

	walkTokens(hostTokens);
}

type GrammarRef = Grammar | string | undefined | null;

function resolve (ref: GrammarRef, components: Registry): Grammar | undefined {
	if (!ref) {
		return undefined;
	}
	else if (typeof ref === 'string') {
		return components.getLanguage(ref);
	}
	else {
		return ref;
	}
}

export function templating (
	code: string,
	hostGrammar: GrammarRef,
	templateGrammar: GrammarRef,
	Prism: Prism
): TokenStream {
	hostGrammar = resolve(hostGrammar, Prism.components);
	templateGrammar = resolve(templateGrammar, Prism.components);

	const { hostCode, tokenStack } = buildPlaceholders(code, templateGrammar, Prism);

	const tokens = hostGrammar ? Prism.tokenize(hostCode, hostGrammar) : [hostCode];
	insertIntoHostToken(tokens, tokenStack);
	return tokens;
}

export function embeddedIn (hostGrammar: GrammarRef): NonNullable<Grammar[typeof tokenize]> {
	return (code, templateGrammar, Prism) => {
		return templating(code, hostGrammar, withoutTokenize(templateGrammar), Prism);
	};
}
