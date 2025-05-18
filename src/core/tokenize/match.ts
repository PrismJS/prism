import { Token } from '../classes/token';
import singleton from '../prism';
import { tokenize } from './tokenize';
import { resolve, tokenizeByNamedGroups } from './util';
import type { Grammar, GrammarToken, GrammarTokens, RegExpLike, TokenStream } from '../../types';
import type {
	LinkedList,
	LinkedListHeadNode,
	LinkedListMiddleNode,
	LinkedListTailNode,
} from '../linked-list';
import type { Prism } from '../prism';

export function _matchGrammar (
	this: Prism,
	text: string,
	tokenList: LinkedList<string | Token>,
	grammar: GrammarTokens,
	startNode: LinkedListHeadNode<string | Token> | LinkedListMiddleNode<string | Token>,
	startPos: number,
	rematch?: RematchOptions
): void {
	const prism = this ?? singleton;

	grammar = resolve.call(prism, grammar) as Grammar;

	for (const token in grammar) {
		const tokenValue = grammar[token];
		if (!grammar.hasOwnProperty(token) || !tokenValue) {
			continue;
		}

		const patterns = (Array.isArray(tokenValue) ? tokenValue : [tokenValue]) as (
			| RegExpLike
			| GrammarToken
		)[];

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
			if (pattern.source.includes('(?<') && pattern.hasIndices === false) {
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
				let match: RegExpExecArray | null = null;

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
				let content: TokenStream | string = matchStr;
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
				let byGroups = match.groups ? tokenizeByNamedGroups(match) : null;

				if (byGroups && byGroups.length > 1) {
					content = byGroups.map(arg => {
						let content = typeof arg === 'string' ? arg : arg.content;
						let type = typeof arg === 'string' ? undefined : arg.type;

						if (insideGrammar) {
							let localInsideGrammar = insideGrammar[type] ?? insideGrammar;

							if (typeof localInsideGrammar === 'function') {
								// Late resolving
								localInsideGrammar = resolve.call(
									prism,
									localInsideGrammar(match.groups)
								);
							}

							content = tokenize.call(prism, content, localInsideGrammar);
						}

						return typeof arg === 'object' && arg.type
							? new Token(arg.type, content)
							: content;
					});
				}
				else if (insideGrammar) {
					content = tokenize.call(prism, content, insideGrammar as Grammar);
				}

				const wrapped = new Token(token, content, alias, matchStr);
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

					_matchGrammar.call(
						this,
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

function toGrammarToken (pattern: GrammarToken | RegExpLike): GrammarToken {
	if (!pattern.pattern) {
		return { pattern };
	}
	else {
		return pattern;
	}
}

interface RematchOptions {
	cause: string;
	reach: number;
}
