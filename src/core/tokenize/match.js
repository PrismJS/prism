import { Token } from '../classes/token.js';
import singleton from '../prism.js';
import { tokenize } from './tokenize.js';
import { resolve, tokenizeByNamedGroups } from './util.js';

/**
 * @this {Prism}
 * @param {string} text
 * @param {LinkedList<string | Token>} tokenList
 * @param {GrammarTokens} grammar
 * @param {LinkedListHeadNode<string | Token> | LinkedListMiddleNode<string | Token>} startNode
 * @param {number} startPos
 * @param {RematchOptions} [rematch]
 * @returns {void}
 */
export function _matchGrammar (text, tokenList, grammar, startNode, startPos, rematch) {
	const prism = this ?? singleton;

	// @ts-ignore
	grammar = resolve.call(prism, grammar);

	for (const token in grammar) {
		const tokenValue = grammar[token];
		if (
			!grammar.hasOwnProperty(token) ||
			token.startsWith('$') ||
			!tokenValue ||
			typeof tokenValue === 'function' // functional tokens ($inside for now) are handled on L170, and we should ignore them in all other cases
		) {
			continue;
		}

		const patterns = Array.isArray(tokenValue) ? tokenValue : [tokenValue];

		for (let j = 0; j < patterns.length; ++j) {
			if (rematch && rematch.cause === `${token},${j}`) {
				return;
			}

			const patternObj = toGrammarToken(patterns[j]);
			let { pattern, lookbehind = false, greedy = false, alias, inside } = patternObj;
			const insideGrammar = resolve.call(prism, inside);

			let flagsToAdd = '';

			if (greedy && !pattern.global) {
				// Without the global flag, lastIndex won't work
				flagsToAdd += 'g';
			}

			if (pattern.source?.includes('(?<') && pattern.hasIndices === false) {
				// Has named groups, we need to be able to capture their indices
				flagsToAdd += 'd';
			}

			if (flagsToAdd) {
				patternObj.pattern = pattern = RegExp(pattern.source, pattern.flags + flagsToAdd);
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
				/** @type {RegExpExecArray | null} */
				let match = null;

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
					/** @type {LinkedListMiddleNode<string | Token> | LinkedListTailNode<string | Token>} */
					let k = currentNode;
					for (; k.next !== null && (p < to || typeof k.value === 'string'); k = k.next) {
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

				const from = match.index;
				const matchStr = match[0];

				/** @type {TokenStream | string} */
				let content = matchStr;

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

				const byGroups = match.groups ? tokenizeByNamedGroups(match) : null;
				if (byGroups && byGroups.length > 1) {
					content = byGroups
						.map(arg => {
							let content = typeof arg === 'string' ? arg : arg.content;
							const type = typeof arg === 'string' ? undefined : arg.type;

							if (insideGrammar) {
								let localInsideGrammar = type ? insideGrammar[type] : insideGrammar;

								if (typeof localInsideGrammar === 'function') {
									// Late resolving
									localInsideGrammar = resolve.call(
										prism,
										localInsideGrammar(match.groups)
									);
								}

								if (localInsideGrammar) {
									// @ts-ignore
									content = tokenize.call(prism, content, localInsideGrammar);
								}
							}

							return typeof arg === 'object' && arg.type
								? new Token(arg.type, content)
								: content;
						})
						.flat(); // Flatten tokens like ['foo']
				}
				else if (insideGrammar) {
					// @ts-ignore
					content = tokenize.call(prism, content, insideGrammar);
				}

				const wrapped = new Token(token, content, alias, matchStr);
				currentNode = tokenList.addAfter(removeFrom, wrapped);

				if (after) {
					tokenList.addAfter(currentNode, after);
				}

				if (removeCount > 1) {
					// at least one Token object was removed, so we have to do some rematching
					// this can only happen if the current pattern is greedy

					/** @type {RematchOptions} */
					const nestedRematch = {
						cause: `${token},${j}`,
						reach,
					};
					_matchGrammar.call(
						prism,
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

/**
 * @param {RegExp} pattern
 * @param {number} pos
 * @param {string} text
 * @param {boolean} lookbehind
 */
function matchPattern (pattern, pos, text, lookbehind) {
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
 * @param {GrammarToken | RegExpLike} pattern
 * @returns {GrammarToken}
 */
function toGrammarToken (pattern) {
	if (!pattern.pattern) {
		return { pattern };
	}
	else {
		return pattern;
	}
}

/**
 * @typedef {object} RematchOptions
 * @property {string} cause
 * @property {number} reach
 */

/**
 * @import { Prism } from '../prism.js';
 * @import { Grammar, GrammarToken, GrammarTokens, TokenStream, RegExpLike } from '../../types.d.ts';
 */

/**
 * @template T
 * @typedef {import('../../core/linked-list.js').LinkedList<T>} LinkedList
 */

/**
 * @template T
 * @typedef {import('../../core/linked-list.js').LinkedListHeadNode<T>} LinkedListHeadNode
 */

/**
 * @template T
 * @typedef {import('../../core/linked-list.js').LinkedListMiddleNode<T>} LinkedListMiddleNode
 */

/**
 * @template T
 * @typedef {import('../../core/linked-list.js').LinkedListTailNode<T>} LinkedListTailNode
 */
