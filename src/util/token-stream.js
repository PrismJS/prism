import { getTextContent, Token } from '../core/classes/token.js';

/**
 * Splits a token stream at the given ascending text offsets.
 *
 * A token that straddles an offset is split into two tokens with the same type and alias,
 * recursively, so that every returned segment is a well-formed token stream. The input is not
 * modified, but the tokens that do not straddle an offset are shared with it rather than copied,
 * so mutating a segment — with `insertTokens`, say — writes through into the input. This is the
 * primitive for merging one tokenized structure with another over the same text: highlight the
 * text as one whole, then split the result where the structure has its boundaries.
 *
 * @param {TokenStream} stream
 * @param {number[]} offsets
 * @returns {TokenStream[]} `offsets.length + 1` segments
 */
export function splitTokenStream (stream, offsets) {
	/** @type {TokenStream[]} */
	const segments = [];
	/** @type {TokenStream} */
	let current = [];
	let pos = 0;
	let next = 0;

	for (let item of stream) {
		// Once every offset is consumed, the rest of the stream is the tail as-is
		if (next === offsets.length) {
			current.push(item);
			continue;
		}

		let start = pos;
		pos += getTextContent(item).length;

		// Every offset up to the end of this item closes a segment, splitting off the part
		// of the item that still belongs to it
		while (next < offsets.length && (offsets[next] < pos || offsets[next] === start)) {
			const offset = offsets[next++];
			if (offset > start) {
				const [left, right] = splitItem(item, offset - start);
				current.push(left);
				item = right;
				start = offset;
			}
			segments.push(current);
			current = [];
		}

		current.push(item);
	}

	segments.push(current);
	while (segments.length <= offsets.length) {
		segments.push([]);
	}

	return segments;
}

/**
 * @param {string | Token} item
 * @param {number} offset
 * @returns {[string | Token, string | Token]}
 */
function splitItem (item, offset) {
	if (typeof item === 'string') {
		return [item.slice(0, offset), item.slice(offset)];
	}

	const [a, b] =
		typeof item.content === 'string'
			? [item.content.slice(0, offset), item.content.slice(offset)]
			: splitTokenStream(item.content, [offset]);

	// Each half gets its own alias array: `addAlias` on one must not reach the other or the original
	const alias = () => (Array.isArray(item.alias) ? [...item.alias] : item.alias);

	return [new Token(item.type, a, alias()), new Token(item.type, b, alias())];
}

/**
 * Replaces `count` items of `array` from `start` with `items`, in place.
 *
 * `array.splice(start, count, ...items)` passes every item as an argument, which overflows the
 * stack on a large document, so the items are pushed one by one instead.
 *
 * @template T
 * @param {T[]} array
 * @param {number} start
 * @param {number} count
 * @param {readonly T[]} items
 */
export function replaceRange (array, start, count, items) {
	const tail = array.slice(start + count);
	array.length = start;

	for (const item of items) {
		array.push(item);
	}
	for (const item of tail) {
		array.push(item);
	}
}

/**
 * Returns whether a token matches one of the given names by type or alias.
 *
 * @param {Token} token
 * @param {ReadonlySet<string>} names
 * @returns {boolean}
 */
export function tokenMatches (token, names) {
	if (names.has(token.type)) {
		return true;
	}

	const alias = token.alias;
	return Array.isArray(alias) ? alias.some(a => names.has(a)) : alias !== undefined && names.has(alias);
}

/**
 * Inserts tokens into a token stream at the given ascending text offsets, in place.
 *
 * An offset inside a token inserts into that token's content (as deep as the offset requires,
 * splitting strings); an offset at a boundary between items inserts between them, at the
 * outermost level where that boundary exists.
 *
 * @param {TokenStream} stream
 * @param {[offset: number, token: Token][]} insertions
 */
export function insertTokens (stream, insertions) {
	// Out of order, the walk moves backwards and slices text away without a word
	insertions.forEach(([offset], i) => {
		if (offset < 0 || (i > 0 && offset < insertions[i - 1][0])) {
			throw new Error(`insertTokens: offsets must be ascending and non-negative, got ${offset} at ${i}.`);
		}
	});

	let pos = 0;
	let j = 0;

	/** @param {TokenStream} stream */
	const walk = stream => {
		for (let i = 0; i < stream.length && j < insertions.length; i++) {
			// Insertions right before this item go before it, not inside it
			while (j < insertions.length && insertions[j][0] === pos) {
				stream.splice(i++, 0, insertions[j++][1]);
			}
			if (i >= stream.length) {
				break;
			}

			const item = stream[i];
			const content = typeof item === 'string' ? item : item.content;

			if (typeof content !== 'string') {
				walk(content);
				continue;
			}

			const end = pos + content.length;
			if (j < insertions.length && insertions[j][0] < end) {
				// Split the string around the tokens that belong inside it
				/** @type {TokenStream} */
				const parts = [];
				let last = pos;
				while (j < insertions.length && insertions[j][0] < end) {
					const [offset, token] = insertions[j++];
					if (offset > last) {
						parts.push(content.slice(last - pos, offset - pos));
					}
					parts.push(token);
					last = offset;
				}
				parts.push(content.slice(last - pos));

				if (typeof item === 'string') {
					replaceRange(stream, i, 1, parts);
					i += parts.length - 1;
				}
				else {
					item.content = parts;
				}
			}
			pos = end;
		}
	};

	walk(stream);

	// Anything left goes at the very end
	for (; j < insertions.length; j++) {
		stream.push(insertions[j][1]);
	}
}

/** @import { TokenStream } from '../types.d.ts' */
