import { getTextContent } from '../../core/token.js';
import { withoutTokenize } from '../language-util.js';

/**
 * @typedef {import('../../core/token').Token} Token
 */

const placeholderPattern = /___PH\d+___/;

/**
 * @param {number} id
 * @returns {string}
 */
function getPlaceholder(id) {
	return `___PH${id}___`;
}

/**
 * @param {string} code
 * @param {import('../../types').Grammar | undefined} grammar
 * @param {import('../../core/prism').Prism} Prism
 * @returns {{ hostCode: string, tokenStack: TokenStack }}
 *
 * @typedef {[number, Token][]} TokenStack
 */
function buildPlaceholders(code, grammar, Prism) {
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
		} else if (token.type.startsWith('ignore')) {
			hostCode += getTextContent(token.content);
		} else {
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
 *
 * @param {import('../../core/token').TokenStream} hostTokens
 * @param {TokenStack} tokenStack
 */
function insertIntoHostToken(hostTokens, tokenStack) {
	let j = 0;

	/**
	 * @param {import('../../core/token').TokenStream} tokens
	 */
	const walkTokens = (tokens) => {
		for (let i = 0; i < tokens.length; i++) {
			// all placeholders are replaced already
			if (j >= tokenStack.length) {
				break;
			}

			const token = tokens[i];
			if (typeof token === 'string' || typeof token.content === 'string') {
				const [id, t] = tokenStack[j];
				const s = typeof token === 'string' ? token : /** @type {string} */(token.content);
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
					} else {
						token.content = replacement;
					}
				}
			} else {
				walkTokens(token.content);
			}
		}

		return tokens;
	};

	walkTokens(hostTokens);
}

/**
 * @param {import('../../types').Grammar | string | undefined | null} ref
 * @param {import('../../core/registry').Registry} components
 * @typedef {import('../../types').Grammar | string | undefined | null} GrammarRef
 * @returns {import('../../types').Grammar | undefined}
 */
function resolve(ref, components) {
	if (!ref) {
		return undefined;
	} else if (typeof ref === 'string') {
		return components.getLanguage(ref);
	} else {
		return ref;
	}
}

/**
 * @param {string} code
 * @param {GrammarRef} hostGrammar
 * @param {GrammarRef} templateGrammar
 * @param {import('../../core/prism').Prism} Prism
 * @returns {import('../../core/token').TokenStream}
 */
export function templating(code, hostGrammar, templateGrammar, Prism) {
	hostGrammar = resolve(hostGrammar, Prism.components);
	templateGrammar = resolve(templateGrammar, Prism.components);

	const { hostCode, tokenStack } = buildPlaceholders(code, templateGrammar, Prism);

	const tokens = hostGrammar ? Prism.tokenize(hostCode, hostGrammar) : [hostCode];
	insertIntoHostToken(tokens, tokenStack);
	return tokens;
}

/**
 * @param {GrammarRef} hostGrammar
 * @returns {NonNullable<import('../../types').Grammar[import('../symbols').tokenize]>}
 */
export function embeddedIn(hostGrammar) {
	return (code, templateGrammar, Prism) => {
		return templating(code, hostGrammar, withoutTokenize(templateGrammar), Prism);
	};
}
