import { insertBefore } from '../shared/language-util';
import xml from './prism-xml';
import type { Grammar, GrammarToken, LanguageProto } from '../types';

/**
 * Adds an inlined language to markup.
 *
 * An example of an inlined language is CSS with `<style>` tags.
 *
 * @param tagName The name of the tag that contains the inlined language. This name will be treated as
 * case insensitive.
 * @param lang The language key.
 * @example
 * inlineEmbedded('style', 'css');
 */
function inlineEmbedded(tagName: string, lang: string): GrammarToken {
	return {
		pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, () => tagName), 'i'),
		lookbehind: true,
		greedy: true,
		inside: {
			'included-cdata': {
				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
				inside: {
					['language-' + lang]: {
						pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
						lookbehind: true,
						inside: lang
					},
					'cdata': /^<!\[CDATA\[|\]\]>$/i
				}
			},
			['language-' + lang]: {
				pattern: /[\s\S]+/,
				inside: lang
			}
		}
	};
}

/**
 * Returns a pattern to highlight languages embedded in HTML attributes.
 *
 * An example of an inlined language is CSS with `style` attributes.
 *
 * @param attrName The name of the tag that contains the inlined language. This name will be treated as
 * case insensitive.
 * @param lang The language key.
 * @example
 * attributeEmbedded('style', 'css');
 */
function attributeEmbedded(attrName: string, lang: string): GrammarToken {
	return {
		pattern: RegExp(
			/(^|["'\s])/.source + '(?:' + attrName + ')' + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
			'i'
		),
		lookbehind: true,
		inside: {
			'attr-name': /^[^\s=]+/,
			'attr-value': {
				pattern: /=[\s\S]+/,
				inside: {
					'value': {
						pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
						lookbehind: true,
						alias: [lang, 'language-' + lang],
						inside: lang
					},
					'punctuation': [
						{
							pattern: /^=/,
							alias: 'attr-equals'
						},
						/"|'/
					]
				}
			}
		}
	};
}

export default {
	id: 'markup',
	require: xml,
	alias: ['html', 'svg', 'mathml'],
	grammar({ extend }) {
		const markup = extend('xml', {});

		insertBefore(markup, 'cdata', {
			'style': inlineEmbedded('style', 'css'),
			'script': inlineEmbedded('script', 'javascript'),
		});

		const tag = markup.tag as GrammarToken & { inside: Grammar };
		insertBefore(tag.inside, 'attr-value', {
			'special-attr': [
				attributeEmbedded('style', 'css'),
				// add attribute support for all DOM events.
				// https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events
				attributeEmbedded(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source, 'javascript'),
			]
		});

		return markup;
	}
} as LanguageProto<'markup'>;
