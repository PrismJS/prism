import { getTextContent } from '../../core/classes/token.js';
import { insertTokens, splitTokenStream, tokenMatches } from '../../util/token-stream.js';
import { resolve } from './util.js';

/** The name of the container of the unmatched text in a selector. */
const TEXT = ':text';

/**
 * Tokenizes `text` with `grammar`, then highlights the parts of the result selected by
 * `grammar.$inner` with the inner language, as one whole per selector, and puts the tokens
 * back where the parts were.
 *
 * A selector names *containers*, separated by commas: token names (matching a token's type or
 * alias) and `:text` for the unmatched text at the top level. A container contributes the plain
 * strings directly inside it, in document order (a token whose content is a single string
 * contributes that string). The strings of one selector are concatenated, tokenized with the
 * inner language, and the resulting tokens are put back into the strings' places: tokens that
 * span several strings of the same container stay whole, with the container's other tokens
 * inserted into them; tokens that span different containers are split.
 *
 * With several selectors, this happens once per selector; a container covered by more than one
 * takes the tokens of the last.
 *
 * Top-level tokens whose type starts with `ignore` count as unmatched text and are dissolved.
 *
 * @param {string} text
 * @param {Grammar} grammar A grammar with `$inner`
 * @param {Prism} prism
 * @returns {TokenStream}
 */
export function embed (text, grammar, prism) {
	// Don't recurse into ourselves
	const { $inner, $tokenize, ...tokens } = grammar;
	void $tokenize;

	const outer = prism.tokenize(text, tokens);
	const { language, select } = normalizeInner($inner);
	const inner = /** @type {Grammar | undefined} */ (resolve.call(prism, language));
	if (!inner) {
		return outer;
	}

	// Collect the text of every selector before anything is put back, so all see the pristine tokens
	const documents = select.map(selector => {
		const runs = collectRuns(outer, parseSelector(selector));
		const offsets = runs.slice(0, -1).map(run => run.text.length);
		offsets.forEach((length, i) => (offsets[i] = length + (offsets[i - 1] ?? 0)));
		const code = runs.map(run => run.text).join('');
		return { runs, segments: runs.length ? splitTokenStream(prism.tokenize(code, inner), offsets) : [] };
	});

	// Put the tokens back, last selector first and back to front, so that a container selected
	// by several selectors takes the tokens of the last, and indices stay valid
	const done = new Set();
	for (const { runs, segments } of documents.reverse()) {
		for (let i = runs.length - 1; i >= 0; i--) {
			if (!done.has(runs[i].container)) {
				done.add(runs[i].container);
				runs[i].replace(segments[i]);
			}
		}
	}

	return outer;
}

/**
 * Whether the given `$inner` value is the object form (`{ language, select }`) rather than a
 * grammar reference. Grammars never have strings (or arrays of them) as values, so `select` decides.
 *
 * @param {unknown} value
 * @returns {value is InnerSpec}
 */
export function isInnerSpec (value) {
	const select = /** @type {InnerSpec | null} */ (value)?.select;
	return typeof select === 'string' || (Array.isArray(select) && select.every(s => typeof s === 'string'));
}

/**
 * @param {Grammar['$inner']} value
 * @returns {{ language: GrammarRef, select: string[] }}
 */
function normalizeInner (value) {
	if (isInnerSpec(value)) {
		return { language: value.language, select: [value.select ?? TEXT].flat() };
	}
	return { language: /** @type {GrammarRef} */ (value), select: [TEXT] };
}

/**
 * @param {string} selector
 * @returns {Selector}
 */
function parseSelector (selector) {
	const names = new Set(selector.split(',').map(s => s.trim()).filter(Boolean));
	return { text: names.delete(TEXT), names };
}

/**
 * Collects one run per selected container, in document order: its strings, and the tokens
 * between them.
 *
 * @param {TokenStream} stream
 * @param {Selector} selector
 * @returns {Run[]}
 */
function collectRuns (stream, { text, names }) {
	/** @type {Run[]} */
	const runs = [];

	/**
	 * @param {TokenStream} container
	 * @param {boolean} root
	 */
	const collect = (container, root) => {
		let text = '';
		let start = -1;
		let end = -1;
		/** @type {[offset: number, token: Token, index: number][]} */
		const between = [];

		container.forEach((item, i) => {
			if (typeof item === 'string' || (root && item.type.startsWith('ignore'))) {
				start = start === -1 ? i : start;
				end = i;
				text += getTextContent(item);
			}
			else if (start !== -1) {
				between.push([text.length, item, i]);
			}
		});

		if (start !== -1) {
			// Tokens after the last string stay where they are
			const inside = between.filter(([, , i]) => i < end).map(([offset, token]) => /** @type {[number, Token]} */ ([offset, token]));
			runs.push({
				container,
				text,
				replace: segment => {
					insertTokens(segment, inside);
					container.splice(start, end - start + 1, ...segment);
				},
			});
		}
	};

	/**
	 * @param {TokenStream} stream
	 * @param {boolean} root
	 */
	const walk = (stream, root) => {
		if (root && text) {
			collect(stream, true);
		}
		for (const item of stream) {
			if (typeof item === 'string') {
				continue;
			}
			if (!tokenMatches(item, names)) {
				if (typeof item.content !== 'string') {
					walk(item.content, false);
				}
			}
			else if (typeof item.content === 'string') {
				const token = item;
				runs.push({ container: item, text: item.content, replace: segment => (token.content = segment) });
			}
			else {
				collect(item.content, false);
			}
		}
	};

	walk(stream, true);
	return runs;
}

/**
 * @import { Prism } from '../prism.js';
 * @import { Token } from '../classes/token.js';
 * @import { Grammar, GrammarRef, InnerSpec, TokenStream } from '../../types.d.ts';
 */

/**
 * @typedef {object} Selector
 * @property {boolean} text Whether the unmatched text is selected
 * @property {Set<string>} names The selected token names
 */

/**
 * @typedef {object} Run
 * @property {TokenStream | Token} container The container the run belongs to
 * @property {string} text The concatenated strings of the run
 * @property {(segment: TokenStream) => void} replace Puts the tokens of the text back
 */
