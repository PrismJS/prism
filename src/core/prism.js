import { getLanguage, setLanguage } from '../shared/dom-util.js';
import { rest, tokenize } from '../shared/symbols.js';
import { htmlEncode } from '../shared/util.js';
import { HookState } from './hook-state.js';
import { Hooks } from './hooks.js';
import { LinkedList } from './linked-list.js';
import { Registry } from './registry.js';
import { Token } from './token.js';

/**
 * @typedef {import("./hooks-env").HookEnvMap} EnvMap
 */

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 */
export class Prism {
	constructor() {
		this.hooks = new Hooks();
		this.components = new Registry(this);
		/**
		 * @type {Partial<Record<string, unknown> & import('../known-plugins').KnownPlugins>}
		 */
		this.plugins = {};
	}

	/**
	 * This is the most high-level function in Prism’s API.
	 * It queries all the elements that have a `.language-xxxx` class and then calls {@link Prism#highlightElement} on
	 * each one of them.
	 *
	 * The following hooks will be run:
	 * 1. `before-highlightall`
	 * 2. `before-all-elements-highlight`
	 * 3. All hooks of {@link Prism#highlightElement} for each element.
	 *
	 * @param {import("./prism-types").HighlightAllOptions} [options]
	 */
	highlightAll(options = {}) {
		const { root, async, callback } = options;

		const env = /** @type {EnvMap["before-highlightall"] | EnvMap["before-all-elements-highlight"]} */ ({
			callback,
			root: root ?? getRootDocument(),
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
			state: new HookState()
		});

		this.hooks.run('before-highlightall', env);

		// @ts-ignore
		env.elements = [...env.root.querySelectorAll(env.selector)];

		// @ts-ignore
		this.hooks.run('before-all-elements-highlight', env);

		// @ts-ignore
		for (const element of env.elements) {
			this.highlightElement(element, { async, callback: env.callback });
		}
	}

	/**
	 * Highlights the code inside a single element.
	 *
	 * The following hooks will be run:
	 * 1. `before-sanity-check`
	 * 2. `before-highlight`
	 * 3. All hooks of {@link Prism#highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
	 * 4. `before-insert`
	 * 5. `after-highlight`
	 * 6. `complete`
	 *
	 * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
	 * the element's language.
	 *
	 * @param {Element} element The element containing the code.
	 * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
	 * @param {import("./prism-types").HighlightElementOptions} [options]
	 */
	highlightElement(element, options = {}) {
		const { async, callback } = options;

		// Find language
		const language = getLanguage(element);
		const languageId = this.components.resolveAlias(language);
		const grammar = this.components.getLanguage(languageId);

		// Set language on the element, if not present
		setLanguage(element, language);

		// Set language on the parent, for styling
		let parent = element.parentElement;
		if (parent && parent.nodeName.toLowerCase() === 'pre') {
			setLanguage(parent, language);
		}

		const code = /** @type {string} */ (element.textContent);

		/** @type {EnvMap["before-sanity-check"]} */
		const env = {
			element,
			language,
			grammar,
			code,
			state: new HookState()
		};

		/** @param {string} highlightedCode */
		const insertHighlightedCode = (highlightedCode) => {
			// @ts-ignore
			env.highlightedCode = highlightedCode;

			// @ts-ignore
			this.hooks.run('before-insert', env);

			// @ts-ignore
			env.element.innerHTML = env.highlightedCode;

			// @ts-ignore
			this.hooks.run('after-highlight', env);
			this.hooks.run('complete', env);
			callback && callback(env.element);
		};

		this.hooks.run('before-sanity-check', env);

		// plugins may change/add the parent/element
		parent = env.element.parentElement;
		if (parent && parent.nodeName.toLowerCase() === 'pre' && !parent.hasAttribute('tabindex')) {
			parent.setAttribute('tabindex', '0');
		}

		if (!env.code) {
			this.hooks.run('complete', env);
			callback && callback(env.element);
			return;
		}

		this.hooks.run('before-highlight', env);

		if (!env.grammar) {
			insertHighlightedCode(htmlEncode(env.code));
			return;
		}

		if (async) {
			async({
				language: env.language,
				code: env.code,
				grammar: env.grammar,
			}).then(insertHighlightedCode);
		} else {
			insertHighlightedCode(this.highlight(env.code, env.language, { grammar: env.grammar }));
		}
	}

	/**
	 * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
	 * and the language definitions to use, and returns a string with the HTML produced.
	 *
	 * The following hooks will be run:
	 * 1. `before-tokenize`
	 * 2. `after-tokenize`
	 * 3. `wrap`: On each {@link Token}.
	 *
	 * @param {string} text A string with the code to be highlighted.
	 * @param {string} language The name of the language definition passed to `grammar`.
	 * @param {import("./prism-types").HighlightOptions} [options] An object containing the tokens to use.
	 *
	 * Usually a language definition like `Prism.languages.markup`.
	 * @returns {string} The highlighted HTML.
	 * @example
	 * Prism.highlight('var foo = true;', 'javascript');
	 */
	highlight(text, language, options) {
		const languageId = this.components.resolveAlias(language);
		const grammar = options?.grammar ?? this.components.getLanguage(languageId);

		/** @type {EnvMap["before-tokenize"] | EnvMap["after-tokenize"]} */
		const env = ({
			code: text,
			grammar,
			language
		});
		this.hooks.run('before-tokenize', env);
		if (!env.grammar) {
			throw new Error('The language "' + env.language + '" has no grammar.');
		}
		// @ts-ignore
		env.tokens = this.tokenize(env.code, env.grammar);
		// @ts-ignore
		this.hooks.run('after-tokenize', env);

		// @ts-ignore
		return stringify(env.tokens, env.language, this.hooks);
	}

	/**
	 * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
	 * and the language definitions to use, and returns an array with the tokenized code.
	 *
	 * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
	 *
	 * This method could be useful in other contexts as well, as a very crude parser.
	 *
	 * @param {string} text A string with the code to be highlighted.
	 * @param {import("../types").Grammar} grammar An object containing the tokens to use.
	 *
	 * Usually a language definition like `Prism.languages.markup`.
	 * @returns {import("./token").TokenStream} An array of strings and tokens, a token stream.
	 * @example
	 * let code = `var foo = 0;`;
	 * let tokens = Prism.tokenize(code, Prism.getLanguage('javascript'));
	 * tokens.forEach(token => {
	 *     if (token instanceof Token && token.type === 'number') {
	 *         console.log(`Found numeric literal: ${token.content}`);
	 *     }
	 * });
	 */
	tokenize(text, grammar) {
		const customTokenize = grammar[tokenize];
		if (customTokenize) {
			return customTokenize(text, grammar, this);
		}

		let restGrammar = resolve(this.components, grammar[rest]);
		while (restGrammar) {
			grammar = { ...grammar, ...restGrammar };
			restGrammar = resolve(this.components, restGrammar[rest]);
		}

		/** @type {LinkedList<string | Token>} */
		const tokenList = new LinkedList();
		tokenList.addAfter(tokenList.head, text);

		this._matchGrammar(text, tokenList, grammar, tokenList.head, 0);

		return tokenList.toArray();
	}

	/**
	 * @param {string} text
	 * @param {LinkedList<string | Token>} tokenList
	 * @param {import("../types").GrammarTokens} grammar
	 * @param {import("./linked-list").LinkedListHeadNode<string | Token> | import("./linked-list").LinkedListMiddleNode<string | Token>} startNode
	 * @param {number} startPos
	 * @param {RematchOptions} [rematch]
	 * @returns {void}
	 * @private
	 *
	 * @typedef RematchOptions
	 * @property {string} cause
	 * @property {number} reach
	 */
	_matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
		for (const token in grammar) {
			const tokenValue = grammar[token];
			if (!grammar.hasOwnProperty(token) || !tokenValue) {
				continue;
			}

			const patterns = Array.isArray(tokenValue) ? tokenValue : [tokenValue];

			for (let j = 0; j < patterns.length; ++j) {
				if (rematch && rematch.cause === token + ',' + j) {
					return;
				}

				const patternObj = toGrammarToken(patterns[j]);
				let { pattern, lookbehind = false, greedy = false, alias, inside } = patternObj;
				const insideGrammar = resolve(this.components, inside);

				if (greedy && !pattern.global) {
					// Without the global flag, lastIndex won't work
					patternObj.pattern = pattern = RegExp(pattern.source, pattern.flags + 'g');
				}

				for ( // iterate the token list and keep track of the current token/string position
					let currentNode = startNode.next, pos = startPos;
					currentNode.next !== null;
					pos += currentNode.value.length, currentNode = currentNode.next
				) {

					if (rematch && pos >= rematch.reach) {
						break;
					}

					let str = currentNode.value;

					if (tokenList.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						return;
					}

					if (str instanceof Token) {
						continue;
					}

					let removeCount = 1; // this is the to parameter of removeBetween
					let match;

					if (greedy) {
						match = matchPattern(pattern, pos, text, lookbehind);
						if (!match || match.index >= text.length) {
							break;
						}

						const from = match.index;
						const to = match.index + match[0].length;
						let p = pos;

						// find the node that contains the match
						p += currentNode.value.length;
						while (from >= p) {
							currentNode = currentNode.next;
							if (currentNode.next === null) {
								throw new Error('The linked list and the actual text have become de-synced');
							}
							p += currentNode.value.length;
						}
						// adjust pos (and p)
						p -= currentNode.value.length;
						pos = p;

						// the current node is a Token, then the match starts inside another Token, which is invalid
						if (currentNode.value instanceof Token) {
							continue;
						}

						// find the last node which is affected by this match
						/** @type {import("./linked-list").LinkedListMiddleNode<Token | string> | import("./linked-list").LinkedListTailNode<Token | string>} */
						let k = currentNode;
						for (; k.next !== null && (p < to || typeof k.value === 'string'); k = k.next) {
							removeCount++;
							p += k.value.length;
						}
						removeCount--;

						// replace with the new match
						str = text.slice(pos, p);
						match.index -= pos;
					} else {
						match = matchPattern(pattern, 0, str, lookbehind);
						if (!match) {
							continue;
						}
					}

					// eslint-disable-next-line no-redeclare
					const from = match.index;
					const matchStr = match[0];
					const before = str.slice(0, from);
					const after = str.slice(from + matchStr.length);

					const reach = pos + str.length;
					if (rematch && reach > rematch.reach) {
						rematch.reach = reach;
					}

					let removeFrom = currentNode.prev;

					if (before) {
						removeFrom = tokenList.addAfter(removeFrom, before);
						pos += before.length;
					}

					tokenList.removeRange(removeFrom, removeCount);

					const wrapped = new Token(token, insideGrammar ? this.tokenize(matchStr, insideGrammar) : matchStr, alias, matchStr);
					currentNode = tokenList.addAfter(removeFrom, wrapped);

					if (after) {
						tokenList.addAfter(currentNode, after);
					}

					if (removeCount > 1) {
						// at least one Token object was removed, so we have to do some rematching
						// this can only happen if the current pattern is greedy

						/** @type {RematchOptions} */
						const nestedRematch = {
							cause: token + ',' + j,
							reach
						};
						this._matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

						// the reach might have been extended because of the rematching
						if (rematch && nestedRematch.reach > rematch.reach) {
							rematch.reach = nestedRematch.reach;
						}
					}
				}
			}
		}
	}
}


/**
 * @param {RegExp} pattern
 * @param {number} pos
 * @param {string} text
 * @param {boolean} lookbehind
 * @returns {RegExpExecArray | null}
 */
function matchPattern(pattern, pos, text, lookbehind) {
	pattern.lastIndex = pos;
	const match = pattern.exec(text);
	if (match && lookbehind && match[1]) {
		// change the match to remove the text matched by the Prism lookbehind group
		const lookbehindLength = match[1].length;
		match.index += lookbehindLength;
		match[0] = match[0].slice(lookbehindLength);
	}
	return match;
}


/**
 * Converts the given token or token stream to an HTML representation.
 *
 * The following hooks will be run:
 * 1. `wrap`: On each {@link Token}.
 *
 * @param {string | Token | import("./token").TokenStream} o The token or token stream to be converted.
 * @param {string} language The name of current language.
 * @param {Hooks} hooks
 * @returns {string} The HTML representation of the token or token stream.
 */
function stringify(o, language, hooks) {
	if (typeof o === 'string') {
		return htmlEncode(o);
	}
	if (Array.isArray(o)) {
		let s = '';
		o.forEach((e) => {
			s += stringify(e, language, hooks);
		});
		return s;
	}

	/** @type {EnvMap["wrap"]} */
	const env = {
		type: o.type,
		content: stringify(o.content, language, hooks),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language
	};

	const aliases = o.alias;
	if (aliases) {
		if (Array.isArray(aliases)) {
			env.classes.push(...aliases);
		} else {
			env.classes.push(aliases);
		}
	}

	hooks.run('wrap', env);

	let attributes = '';
	for (const name in env.attributes) {
		attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
}

/**
 * @param {import("../types").GrammarToken | RegExp} pattern
 * @returns {import("../types").GrammarToken}
 */
function toGrammarToken(pattern) {
	if (pattern.exec) {
		return { pattern };
	} else {
		return pattern;
	}
}

/**
 * @param {Registry} components
 * @param {import("../types").Grammar | string | null | undefined} reference
 * @returns {import("../types").Grammar | undefined}
 */
function resolve(components, reference) {
	if (reference) {
		if (typeof reference === 'string') {
			return components.getLanguage(reference);
		}
		return reference;
	}
	return undefined;
}

function getRootDocument() {
	if (typeof document !== 'undefined') {
		// eslint-disable-next-line no-undef
		return document;
	}
	throw new Error('Cannot find global document variable. Please provide an explicit root for highlightAll.');
}
