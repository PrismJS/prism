import { Token, getTextContent } from '../core/token';
import { withoutTokenize } from '../shared/language-util';
import { tokenize } from '../shared/symbols';
import markup from './prism-markup';
import type { TokenStream } from '../core/token';
import type { Grammar, GrammarToken, LanguageProto } from '../types';

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
					if (openedTags.length > 0 && openedTags[openedTags.length - 1].tagName === getTextContent(nestedTag)) {
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
							tagName: getTextContent(nestedTag),
							openedBraces: 0
						});
					}
				}
			} else {
				const next = tokens[i + 1];
				const prev = tokens[i - 1];
				if (
					openedTags.length > 0 && token.type === 'punctuation' && token.content === '{' &&
					// Ignore `{{`
					(typeof next !== 'object' || next.type !== 'punctuation' || next.content !== '{') &&
					(typeof prev !== 'object' || prev.type !== 'plain-text' || prev.content !== '{')
				) {
					// Here we might have entered an XQuery expression inside a tag
					openedTags[openedTags.length - 1].openedBraces++;

				} else if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces > 0 && token.type === 'punctuation' && token.content === '}') {

					// Here we might have left an XQuery expression inside a tag
					openedTags[openedTags.length - 1].openedBraces--;

				} else if (token.type !== 'comment') {
					notTagNorBrace = true;
				}
			}
		}
		if (notTagNorBrace || !isToken) {
			if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces === 0) {
				// Here we are inside a tag, and not inside an XQuery expression.
				// That's plain text: drop any tokens matched.
				let plainText = getTextContent(token);

				// And merge text with adjacent text
				const next = tokens[i + 1];
				if (next && (typeof next === 'string' || next.type === 'plain-text')) {
					plainText += getTextContent(next);
					tokens.splice(i + 1, 1);
				}
				const prev = tokens[i - 1];
				if (prev && (typeof prev === 'string' || prev.type === 'plain-text')) {
					plainText = getTextContent(prev) + plainText;
					tokens.splice(i - 1, 1);
					i--;
				}

				if (/^\s+$/.test(plainText)) {
					tokens[i] = plainText;
				} else {
					tokens[i] = new Token('plain-text', plainText, undefined, plainText);
				}
			}
		}

		if (isToken && typeof token.content !== 'string') {
			walkTokens(token.content);
		}
	}
}

export default {
	id: 'xquery',
	require: markup,
	grammar({ extend }) {
		const xquery = extend('markup', {
			'xquery-comment': {
				pattern: /\(:[\s\S]*?:\)/,
				greedy: true,
				alias: 'comment'
			},
			'string': {
				pattern: /(["'])(?:\1\1|(?!\1)[\s\S])*\1/,
				greedy: true
			},
			'extension': {
				pattern: /\(#.+?#\)/,
				alias: 'symbol'
			},
			'variable': /\$[-\w:]+/,
			'axis': {
				pattern: /(^|[^-])(?:ancestor(?:-or-self)?|attribute|child|descendant(?:-or-self)?|following(?:-sibling)?|parent|preceding(?:-sibling)?|self)(?=::)/,
				lookbehind: true,
				alias: 'operator'
			},
			'keyword-operator': {
				pattern: /(^|[^:-])\b(?:and|castable as|div|eq|except|ge|gt|idiv|instance of|intersect|is|le|lt|mod|ne|or|union)\b(?=$|[^:-])/,
				lookbehind: true,
				alias: 'operator'
			},
			'keyword': {
				pattern: /(^|[^:-])\b(?:as|ascending|at|base-uri|boundary-space|case|cast as|collation|construction|copy-namespaces|declare|default|descending|else|empty (?:greatest|least)|encoding|every|external|for|function|if|import|in|inherit|lax|let|map|module|namespace|no-inherit|no-preserve|option|order(?: by|ed|ing)?|preserve|return|satisfies|schema|some|stable|strict|strip|then|to|treat as|typeswitch|unordered|validate|variable|version|where|xquery)\b(?=$|[^:-])/,
				lookbehind: true
			},
			'function': /[\w-]+(?::[\w-]+)*(?=\s*\()/,
			'xquery-element': {
				pattern: /(element\s+)[\w-]+(?::[\w-]+)*/,
				lookbehind: true,
				alias: 'tag'
			},
			'xquery-attribute': {
				pattern: /(attribute\s+)[\w-]+(?::[\w-]+)*/,
				lookbehind: true,
				alias: 'attr-name'
			},
			'builtin': {
				pattern: /(^|[^:-])\b(?:attribute|comment|document|element|processing-instruction|text|xs:(?:ENTITIES|ENTITY|ID|IDREFS?|NCName|NMTOKENS?|NOTATION|Name|QName|anyAtomicType|anyType|anyURI|base64Binary|boolean|byte|date|dateTime|dayTimeDuration|decimal|double|duration|float|gDay|gMonth|gMonthDay|gYear|gYearMonth|hexBinary|int|integer|language|long|negativeInteger|nonNegativeInteger|nonPositiveInteger|normalizedString|positiveInteger|short|string|time|token|unsigned(?:Byte|Int|Long|Short)|untyped(?:Atomic)?|yearMonthDuration))\b(?=$|[^:-])/,
				lookbehind: true
			},
			'number': /\b\d+(?:\.\d+)?(?:E[+-]?\d+)?/,
			'operator': [
				/[+*=?|@]|\.\.?|:=|!=|<[=<]?|>[=>]?/,
				{
					pattern: /(\s)-(?=\s)/,
					lookbehind: true
				}
			],
			'punctuation': /[[\](){},;:/]/
		});

		const tag = xquery['tag'] as GrammarToken;
		tag.pattern = /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|\{(?!\{)(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\}|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/;
		const attrValue = (tag.inside as Grammar)['attr-value'] as GrammarToken;
		attrValue.pattern = /=(?:("|')(?:\\[\s\S]|\{(?!\{)(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\}|(?!\1)[^\\])*\1|[^\s'">=]+)/;
		const attrValueInside = attrValue.inside as Grammar;
		attrValueInside['punctuation'] = /^="|"$/;
		attrValueInside['expression'] = {
			// Allow for two levels of nesting
			pattern: /\{(?!\{)(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\}/,
			alias: 'language-xquery',
			inside: 'xquery'
		};

		xquery[tokenize] = (code, grammar, Prism) => {
			const tokens = Prism.tokenize(code, withoutTokenize(grammar));
			walkTokens(tokens);
			return tokens;
		};

		return xquery;
	}
} as LanguageProto<'xquery'>;
