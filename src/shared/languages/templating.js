import { getTextContent } from '../../core/classes/token.js';
import { resolve } from '../../core/tokenize/util.js';

/**
 * Tokenizes `code` with the template grammar, takes the resulting tokens out, tokenizes
 * everything that is left as one whole with the host grammar, and then puts the template
 * tokens back where they were.
 *
 * This is how templating languages (e.g. Liquid in HTML) and other meta-languages
 * (e.g. a diff of CSS) embed an inner language. Grammars use it declaratively via `$inner`.
 *
 * By default, each template token leaves an identifier-like placeholder behind, so that the
 * host grammar still sees a value where the token was (e.g. an attribute value). Template
 * grammars whose tokens don't stand for anything (e.g. the line prefixes of a diff) set
 * `$placeholder: false` to have them removed without a trace instead.
 *
 * Template tokens whose type starts with `ignore` are not taken out; their text is passed to
 * the host grammar as-is.
 *
 * @param {string} code
 * @param {GrammarRef} hostGrammar
 * @param {GrammarRef} templateGrammar
 * @param {Prism} Prism
 * @returns {TokenStream}
 */
export function templating (code, hostGrammar, templateGrammar, Prism) {
	const host = resolve.call(Prism, hostGrammar);
	const template = /** @type {Grammar | undefined} */ (resolve.call(Prism, templateGrammar));

	let hostCode = code;
	/** @type {Replacement[]} */
	const replacements = [];

	if (template) {
		// Don't recurse into ourselves
		const tokens = { ...template };
		delete tokens.$inner;
		delete tokens.$placeholder;
		delete tokens.$tokenize;
		// A plain lowercase word: anything a host grammar recognizes wraps the token (`___` is
		// markdown emphasis, `PRISMPH` a JS constant). Not unique: tokens go back by position.
		const placeholder = template.$placeholder === false ? '' : 'prismph';

		hostCode = '';
		for (const token of Prism.tokenize(code, tokens)) {
			if (typeof token === 'string') {
				hostCode += token;
			}
			else if (token.type.startsWith('ignore')) {
				hostCode += getTextContent(token.content);
			}
			else {
				replacements.push({ start: hostCode.length, end: hostCode.length + placeholder.length, token });
				hostCode += placeholder;
			}
		}
	}

	const tokens = host ? Prism.tokenize(hostCode, /** @type {Grammar} */ (host)) : [hostCode];
	replaceRanges(tokens, replacements);
	return tokens;
}

/**
 * Replaces the given (ascending, non-overlapping) ranges of the text of a token stream with
 * the given tokens, splitting strings where necessary. Empty ranges are plain insertions.
 *
 * @param {TokenStream} tokens
 * @param {Replacement[]} replacements
 */
function replaceRanges (tokens, replacements) {
	let pos = 0;
	let j = 0;
	// Characters of the current replacement still to be removed from the following strings
	// (only if the host grammar split a placeholder across tokens)
	let skip = 0;

	/** @param {TokenStream} tokens */
	const walk = tokens => {
		for (let i = 0; i < tokens.length && (j < replacements.length || skip > 0); i++) {
			// Insertions right before this item go before it, not inside it
			while (j < replacements.length && replacements[j].start === pos && replacements[j].end === pos) {
				tokens.splice(i++, 0, replacements[j++].token);
			}
			if (i >= tokens.length) {
				break;
			}

			const token = tokens[i];
			const content = typeof token === 'string' ? token : token.content;

			if (typeof content !== 'string') {
				walk(content);
				continue;
			}

			const end = pos + content.length;
			/** @type {TokenStream} */
			const parts = [];
			let last = pos + Math.min(skip, content.length);
			skip -= last - pos;

			while (j < replacements.length && replacements[j].start < end) {
				const { start, end: rangeEnd, token } = replacements[j++];
				if (start > last) {
					parts.push(content.slice(last - pos, start - pos));
				}
				parts.push(token);
				last = Math.min(rangeEnd, end);
				skip = rangeEnd - last;
			}

			if (parts.length > 0 || last > pos) {
				if (last < end) {
					parts.push(content.slice(last - pos));
				}
				if (typeof token === 'string') {
					tokens.splice(i, 1, ...parts);
					i += parts.length - 1;
				}
				else {
					token.content = parts;
				}
			}
			pos = end;
		}
	};

	walk(tokens);

	// Anything left goes at the very end
	for (; j < replacements.length; j++) {
		tokens.push(replacements[j].token);
	}
}

/**
 * @import { Prism } from '../../core.js';
 * @import { TokenStream, Grammar } from '../../types.d.ts';
 */

/**
 * @typedef {Grammar | Function | string | undefined | null} GrammarRef
 */

/**
 * @typedef {object} Replacement
 * @property {number} start Start offset in the host code
 * @property {number} end End offset in the host code (equal to `start` for a plain insertion)
 * @property {import('../../core/classes/token.js').Token} token
 */
