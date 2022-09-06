import { Token, getTextContent } from '../core/token';
import { insertBefore, withoutTokenize } from '../shared/language-util';
import { rest, tokenize } from '../shared/symbols';
import javascript from './prism-javascript';
import markup from './prism-markup';

/**
 * @param {string | Token | import('../core/token.js').TokenStream | undefined} token
 * @returns {string}
 */
function stringifyToken(token) {
	if (!token) {
		return '';
	} else {
		return getTextContent(token);
	}
}

/**
 * @param {import('../core/token.js').TokenStream} tokens
 */
function walkTokens(tokens) {
	const openedTags = [];
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const isToken = typeof token !== 'string';
		let notTagNorBrace = false;

		if (isToken) {
			const nestedTag = token.content[1];
			if (token.type === 'tag' && typeof nestedTag === 'object' && nestedTag.type === 'tag') {
				// We found a tag, now find its kind

				const firstChild = token.content[0];
				if (typeof firstChild === 'object' && firstChild.content === '</') {
					// Closing tag
					if (openedTags.length > 0 && openedTags[openedTags.length - 1].tagName === stringifyToken(nestedTag)) {
						// Pop matching opening tag
						openedTags.pop();
					}
				} else {
					const lastChild = token.content[token.content.length - 1];
					if (typeof lastChild === 'object' && lastChild.content === '/>') {
						// Autoclosed tag, ignore
					} else {
						// Opening tag
						openedTags.push({
							tagName: stringifyToken(nestedTag),
							openedBraces: 0
						});
					}
				}
			} else if (openedTags.length > 0 && token.type === 'punctuation' && token.content === '{') {

				// Here we might have entered a JSX context inside a tag
				openedTags[openedTags.length - 1].openedBraces++;

			} else if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces > 0 && token.type === 'punctuation' && token.content === '}') {

				// Here we might have left a JSX context inside a tag
				openedTags[openedTags.length - 1].openedBraces--;

			} else {
				notTagNorBrace = true;
			}
		}
		if (notTagNorBrace || !isToken) {
			if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces === 0) {
				// Here we are inside a tag, and not inside a JSX context.
				// That's plain text: drop any tokens matched.
				let plainText = stringifyToken(token);

				// And merge text with adjacent text
				/** @type {Token | string | undefined} */
				const next = tokens[i + 1];
				if (next && (typeof next === 'string' || next.type === 'plain-text')) {
					plainText += stringifyToken(next);
					tokens.splice(i + 1, 1);
				}
				/** @type {Token | string | undefined} */
				const prev = tokens[i - 1];
				if (prev && (typeof prev === 'string' || prev.type === 'plain-text')) {
					plainText = stringifyToken(prev) + plainText;
					tokens.splice(i - 1, 1);
					i--;
				}

				tokens[i] = new Token('plain-text', plainText, undefined, plainText);
			}
		}

		if (isToken && typeof token.content !== 'string') {
			walkTokens(token.content);
		}
	}
}

export default /** @type {import("../types").LanguageProto<'jsx'>} */ ({
	id: 'jsx',
	require: [markup, javascript],
	grammar({ extend }) {
		const space = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source;
		const braces = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source;
		let spread = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;

		/**
		 * @param {string} source
		 * @param {string} [flags]
		 */
		function re(source, flags) {
			source = source
				.replace(/<S>/g, () => space)
				.replace(/<BRACES>/g, () => braces)
				.replace(/<SPREAD>/g, () => spread);
			return RegExp(source, flags);
		}

		spread = re(spread).source;


		const javascript = extend('javascript', {});
		const jsx = extend('markup', javascript);

		const tag = /** @type {import('../types').GrammarToken & { inside: import('../types').Grammar}} */ (jsx.tag);
		tag.pattern = re(
			/<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source
		);

		// @ts-ignore
		tag.inside['tag'].pattern = /^(<\/?)[^\s>\/]*/;
		// @ts-ignore
		tag.inside['attr-value'].pattern = /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/;
		// @ts-ignore
		tag.inside['tag'].inside['class-name'] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
		tag.inside['comment'] = javascript['comment'];

		insertBefore(tag.inside, 'attr-name', {
			'spread': {
				pattern: re(/<SPREAD>/.source),
				inside: 'jsx'
			}
		});

		insertBefore(tag.inside, 'special-attr', {
			'script': {
				// Allow for two levels of nesting
				pattern: re(/=<BRACES>/.source),
				alias: 'language-javascript',
				inside: {
					'script-punctuation': {
						pattern: /^=(?=\{)/,
						alias: 'punctuation'
					},
					[rest]: 'jsx'
				},
			}
		});

		jsx[tokenize] = (code, grammar, Prism) => {
			const tokens = Prism.tokenize(code, withoutTokenize(grammar));
			walkTokens(tokens);
			return tokens;
		};

		return jsx;
	}
});
