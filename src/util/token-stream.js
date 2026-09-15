import { getTextContent, Token } from '../core/classes/token.js';

/**
 * Splits a token stream at the given ascending text offsets.
 *
 * A token that straddles an offset is split into two tokens with the same type and alias,
 * recursively, so that every returned segment is a well-formed token stream. The input is not
 * modified. This is the primitive for merging one tokenized structure with another over the
 * same text: highlight the text as one whole, then split the result where the structure has
 * its boundaries.
 *
 * @param {TokenStream} stream
 * @param {number[]} offsets
 * @returns {TokenStream[]} `offsets.length + 1` segments
 */
export function splitTokenStream (stream, offsets) {
	const segments = [];
	let rest = stream;
	let base = 0;

	for (const offset of offsets) {
		const [left, right] = splitAt(rest, offset - base);
		segments.push(left);
		rest = right;
		base = offset;
	}

	segments.push(rest);
	return segments;
}

/**
 * @param {TokenStream} stream
 * @param {number} offset Relative to the start of the stream
 * @returns {[TokenStream, TokenStream]}
 */
function splitAt (stream, offset) {
	/** @type {TokenStream} */
	const left = [];
	let pos = 0;

	for (let i = 0; i < stream.length; i++) {
		if (pos >= offset) {
			return [left, stream.slice(i)];
		}

		const item = stream[i];
		const length = getTextContent(item).length;

		if (pos + length <= offset) {
			left.push(item);
			pos += length;
			continue;
		}

		// This item straddles the offset
		const [a, b] = splitItem(item, offset - pos);
		left.push(a);
		return [left, [b, ...stream.slice(i + 1)]];
	}

	return [left, []];
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
			: splitAt(item.content, offset);

	return [new Token(item.type, a, item.alias), new Token(item.type, b, item.alias)];
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
					stream.splice(i, 1, ...parts);
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
