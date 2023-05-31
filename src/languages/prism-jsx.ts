import { Token, getTextContent } from '../core/token';
import { insertBefore, withoutTokenize } from '../shared/language-util';
import { rest, tokenize } from '../shared/symbols';
import javascript from './prism-javascript';
import markup from './prism-markup';
import type { TokenStream } from '../core/token';
import type { Grammar, GrammarToken, LanguageProto } from '../types';

function stringifyToken(token: string | Token | TokenStream | undefined): string {
	if (!token) {
		return '';
	} else {
		return getTextContent(token);
	}
}

function walkTokens(tokens: TokenStream) {
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
				const next: Token | string | undefined = tokens[i + 1];
				if (next && (typeof next === 'string' || next.type === 'plain-text')) {
					plainText += stringifyToken(next);
					tokens.splice(i + 1, 1);
				}
				const prev: Token | string | undefined = tokens[i - 1];
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

export default {
	id: 'jsx',
	require: [markup, javascript],
	grammar({ extend }) {
		const space = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source;
		const braces = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source;
		let spread = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;

		function re(source: string, flags?: string) {
			source = source
				.replace(/<S>/g, () => space)
				.replace(/<BRACES>/g, () => braces)
				.replace(/<SPREAD>/g, () => spread);
			return RegExp(source, flags);
		}

		spread = re(spread).source;


		const javascript = extend('javascript', {});
		const jsx = extend('markup', javascript);

		const tag = jsx.tag as GrammarToken & { inside: Grammar & { tag: GrammarToken & { inside: Grammar }, 'attr-value': GrammarToken } };
		tag.pattern = re(
			/<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source
		);

		tag.inside['tag'].pattern = /^(<\/?)[^\s>\/]*/;
		tag.inside['attr-value'].pattern = /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/;
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
} as LanguageProto<'jsx'>;
