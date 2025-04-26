import { rest, tokenize } from '../shared/symbols';
import { htmlEncode } from '../shared/util';
import { Hooks } from './hooks';
import { LinkedList } from './linked-list';
import { Registry } from './registry';
import { Token } from './token';
import type { KnownPlugins } from '../known-plugins';
import type { Grammar, GrammarToken, GrammarTokens, RegExpLike } from '../types';
import type { LinkedListHeadNode, LinkedListMiddleNode, LinkedListTailNode } from './linked-list';
import type { TokenStream } from './token';
import { highlightAll, type HighlightAllOptions } from './highlight-all';
import { highlightElement, type HighlightElementOptions } from './highlight-element';
import { highlight, type HighlightOptions } from './highlight';

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me> and contributors <https://github.com/PrismJS/prism/graphs/contributors>
 */
export default class Prism {
	hooks = new Hooks();
	components = new Registry(this);
	plugins: Partial<Record<string, unknown> & KnownPlugins> = {};

	/**
	 * See {@link highlightAll}.
	 */
	highlightAll (options: HighlightAllOptions = {}) {
		return highlightAll.call(this, options);
	}

	/**
	 * See {@link highlightElement}
	 */
	highlightElement (element: Element, options: HighlightElementOptions = {}) {
		return highlightElement.call(this, element, options);
	}

	/**
	 * See {@link highlight}
	 */
	highlight (text: string, language: string, options?: HighlightOptions): string {
		return highlight.call(this, text, language, options);
	}

	/**
	 * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
	 * and the language definitions to use, and returns an array with the tokenized code.
	 *
	 * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
	 *
	 * This method could be useful in other contexts as well, as a very crude parser.
	 *
	 * @param text A string with the code to be highlighted.
	 * @param grammar An object containing the tokens to use.
	 *
	 * Usually a language definition like `Prism.languages.markup`.
	 * @returns An array of strings and tokens, a token stream.
	 * @example
	 * let code = `var foo = 0;`;
	 * let tokens = Prism.tokenize(code, Prism.getLanguage('javascript'));
	 * tokens.forEach(token => {
	 *     if (token instanceof Token && token.type === 'number') {
	 *         console.log(`Found numeric literal: ${token.content}`);
	 *     }
	 * });
	 */
	tokenize (text: string, grammar: Grammar): TokenStream {
		const customTokenize = grammar[tokenize];
		if (customTokenize) {
			return customTokenize(text, grammar, this);
		}

		let restGrammar = resolve(this.components, grammar[rest]);
		while (restGrammar) {
			grammar = { ...grammar, ...restGrammar };
			restGrammar = resolve(this.components, restGrammar[rest]);
		}

		const tokenList = new LinkedList<string | Token>();
		tokenList.addAfter(tokenList.head, text);

		this._matchGrammar(text, tokenList, grammar, tokenList.head, 0);

		return tokenList.toArray();
	}

	private _matchGrammar (
		text: string,
		tokenList: LinkedList<string | Token>,
		grammar: GrammarTokens,
		startNode: LinkedListHeadNode<string | Token> | LinkedListMiddleNode<string | Token>,
		startPos: number,
		rematch?: RematchOptions
	): void {
		for (const token in grammar) {
			const tokenValue = grammar[token];
			if (!grammar.hasOwnProperty(token) || !tokenValue) {
				continue;
			}

			const patterns = Array.isArray(tokenValue) ? tokenValue : [tokenValue];

			for (let j = 0; j < patterns.length; ++j) {
				if (rematch && rematch.cause === `${token},${j}`) {
					return;
				}

				const patternObj = toGrammarToken(patterns[j]);
				let { pattern, lookbehind = false, greedy = false, alias, inside } = patternObj;
				const insideGrammar = resolve(this.components, inside);

				if (greedy && !pattern.global) {
					// Without the global flag, lastIndex won't work
					patternObj.pattern = pattern = RegExp(pattern.source, pattern.flags + 'g');
				}

				for (
					// iterate the token list and keep track of the current token/string position
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
								throw new Error(
									'The linked list and the actual text have become de-synced'
								);
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
						let k:
							| LinkedListMiddleNode<Token | string>
							| LinkedListTailNode<Token | string> = currentNode;
						for (
							;
							k.next !== null && (p < to || typeof k.value === 'string');
							k = k.next
						) {
							removeCount++;
							p += k.value.length;
						}
						removeCount--;

						// replace with the new match
						str = text.slice(pos, p);
						match.index -= pos;
					}
					else {
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

					const wrapped = new Token(
						token,
						insideGrammar ? this.tokenize(matchStr, insideGrammar) : matchStr,
						alias,
						matchStr
					);
					currentNode = tokenList.addAfter(removeFrom, wrapped);

					if (after) {
						tokenList.addAfter(currentNode, after);
					}

					if (removeCount > 1) {
						// at least one Token object was removed, so we have to do some rematching
						// this can only happen if the current pattern is greedy

						const nestedRematch: RematchOptions = {
							cause: `${token},${j}`,
							reach,
						};
						this._matchGrammar(
							text,
							tokenList,
							grammar,
							currentNode.prev,
							pos,
							nestedRematch
						);

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

interface RematchOptions {
	cause: string;
	reach: number;
}

export interface AsyncHighlightingData {
	language: string;
	code: string;
	grammar: Grammar;
}
export type AsyncHighlighter = (data: AsyncHighlightingData) => Promise<string>;

export interface HighlightOptions {
	grammar?: Grammar;
}

function matchPattern (pattern: RegExp, pos: number, text: string, lookbehind: boolean) {
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
 * @param o The token or token stream to be converted.
 * @param language The name of current language.
 * @returns The HTML representation of the token or token stream.
 */
function stringify (o: string | Token | TokenStream, language: string, hooks: Hooks): string {
	if (typeof o === 'string') {
		return htmlEncode(o);
	}
	if (Array.isArray(o)) {
		let s = '';
		o.forEach(e => {
			s += stringify(e, language, hooks);
		});
		return s;
	}

	const env: Record<string, any> = {
		type: o.type,
		content: stringify(o.content, language, hooks),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language,
	};

	const aliases = o.alias;
	if (aliases) {
		if (Array.isArray(aliases)) {
			env.classes.push(...aliases);
		}
		else {
			env.classes.push(aliases);
		}
	}

	hooks.run('wrap', env);

	let attributes = '';
	for (const name in env.attributes) {
		attributes +=
			' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}

	return (
		'<' +
		env.tag +
		' class="' +
		env.classes.join(' ') +
		'"' +
		attributes +
		'>' +
		env.content +
		'</' +
		env.tag +
		'>'
	);
}

function toGrammarToken (pattern: GrammarToken | RegExpLike): GrammarToken {
	if (!pattern.pattern) {
		return { pattern };
	}
	else {
		return pattern;
	}
}

function resolve (
	components: Registry,
	reference: Grammar | string | null | undefined
): Grammar | undefined {
	if (reference) {
		if (typeof reference === 'string') {
			return components.getLanguage(reference);
		}
		return reference;
	}
	return undefined;
}
