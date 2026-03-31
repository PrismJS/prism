import { getTextContent } from '../../core/classes/token.js';
import { resolve } from '../../core/tokenize/util.js';
import { withoutTokenize } from '../../util/language-util.js';

const placeholderPattern = /___PH\d+___/;

/**
 * @param {number} id
 * @returns {string}
 */
function getPlaceholder (id) {
	return `___PH${id}___`;
}

/**
 * @param {string} code
 * @param {Grammar | undefined} grammar
 * @param {Prism} Prism
 * @returns {{ hostCode: string, tokenStack: TokenStack }}
 */
function buildPlaceholders (code, grammar, Prism) {
	if (!grammar) {
		return { hostCode: code, tokenStack: [] };
	}

	const templateTokens = Prism.tokenize(code, grammar);
	const hasPlaceholderLike = placeholderPattern.test(code);

	let hostCode = '';

	/** @type {TokenStack} */
	const tokenStack = [];

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

/**
 * @param {TokenStream} hostTokens
 * @param {TokenStack} tokenStack
 */
function insertIntoHostToken (hostTokens, tokenStack) {
	let j = 0;

	/**
	 * @param {TokenStream} tokens
	 * @returns {TokenStream}
	 */
	const walkTokens = tokens => {
		for (let i = 0; i < tokens.length; i++) {
			// all placeholders are replaced already
			if (j >= tokenStack.length) {
				break;
			}

			const token = tokens[i];
			if (typeof token === 'string' || typeof token.content === 'string') {
				const [id, t] = tokenStack[j];
				const s = typeof token === 'string' ? token : /** @type {string} */ (token.content);
				const placeholder = getPlaceholder(id);

				const index = s.indexOf(placeholder);
				if (index > -1) {
					++j;

					const before = s.substring(0, index);
					const middle = t;
					const after = s.substring(index + placeholder.length);

					/** @type {TokenStream} */
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

/**
 * @param {string} code
 * @param {GrammarRef} hostGrammar
 * @param {GrammarRef} templateGrammar
 * @param {Prism} Prism
 * @returns {TokenStream}
 */
export function templating (code, hostGrammar, templateGrammar, Prism) {
	hostGrammar = resolve.call(Prism, hostGrammar);
	templateGrammar = resolve.call(Prism, templateGrammar);

	const { hostCode, tokenStack } = buildPlaceholders(code, templateGrammar, Prism);

	const tokens = hostGrammar ? Prism.tokenize(hostCode, hostGrammar) : [hostCode];
	insertIntoHostToken(tokens, tokenStack);
	return tokens;
}

/**
 * @param {GrammarRef} hostGrammar
 * @returns {(code: string, grammar: Grammar, Prism: Prism) => TokenStream}
 */
export function embeddedIn (hostGrammar) {
	return (code, templateGrammar, Prism) => {
		return templating(code, hostGrammar, withoutTokenize(templateGrammar), Prism);
	};
}

/**
 * @import { Prism, Token } from '../../core.js';
 * @import { TokenStream, TokenStack, Grammar, LanguageRegistry} from '../../types.d.ts';
 */

/**
 * @typedef {Grammar | string | undefined | null} GrammarRef
 */
