/**
 * Adds an inlined language to markup.
 *
 * An example of an inlined language is CSS with `<style>` tags.
 *
 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
 * case insensitive.
 * @param {string} lang The language key.
 * @returns {import("../types").GrammarToken}
 * @example
 * inlineEmbedded('style', 'css');
 */
function inlineEmbedded(tagName, lang) {
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
 * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
 * case insensitive.
 * @param {string} lang The language key.
 * @returns {import("../types").GrammarToken}
 * @example
 * attributeEmbedded('style', 'css');
 */
function attributeEmbedded(attrName, lang) {
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

export default /** @type {import("../types").LanguageProto<'markup'>} */ ({
	id: 'markup',
	alias: ['html', 'xml', 'svg', 'mathml', 'ssml', 'atom', 'rss'],
	grammar({ extend }) {
		const entity = [
			{
				pattern: /&[\da-z]{1,8};/i,
				alias: 'named-entity'
			},
			/&#x?[\da-f]{1,8};/i
		];

		const markup = {
			'comment': {
				pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
				greedy: true
			},
			'prolog': {
				pattern: /<\?[\s\S]+?\?>/,
				greedy: true
			},
			'doctype': {
				// https://www.w3.org/TR/xml/#NT-doctypedecl
				pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
				greedy: true,
				inside: {
					'internal-subset': {
						pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
						lookbehind: true,
						greedy: true,
						inside: 'markup'
					},
					'string': {
						pattern: /"[^"]*"|'[^']*'/,
						greedy: true
					},
					'punctuation': /^<!|>$|[[\]]/,
					'doctype-tag': /^DOCTYPE/i,
					'name': /[^\s<>'"]+/
				}
			},
			'style': inlineEmbedded('style', 'css'),
			'script': inlineEmbedded('script', 'javascript'),
			'cdata': {
				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
				greedy: true
			},
			'tag': {
				pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
				greedy: true,
				inside: {
					'tag': {
						pattern: /^<\/?[^\s>\/]+/,
						inside: {
							'punctuation': /^<\/?/,
							'namespace': /^[^\s>\/:]+:/
						}
					},
					'special-attr': [
						attributeEmbedded('style', 'css'),
						// add attribute support for all DOM events.
						// https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events
						attributeEmbedded(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source, 'javascript'),
					],
					'attr-value': {
						pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
						inside: {
							'punctuation': [
								{
									pattern: /^=/,
									alias: 'attr-equals'
								},
								{
									pattern: /^(\s*)["']|["']$/,
									lookbehind: true
								}
							],
							'entity': entity
						}
					},
					'punctuation': /\/?>/,
					'attr-name': {
						pattern: /[^\s>\/]+/,
						inside: {
							'namespace': /^[^\s>\/:]+:/
						}
					}

				}
			},
			'entity': entity
		};

		Prism.languages.xml = extend('markup', {});
		Prism.languages.ssml = Prism.languages.xml;
		Prism.languages.atom = Prism.languages.xml;
		Prism.languages.rss = Prism.languages.xml;

		return markup;
	},
	effect(Prism) {
		// Plugin to make entity title show the real entity, idea by Roman Komarov
		return Prism.hooks.add('wrap', (env) => {
			if (env.type === 'entity') {
				env.attributes['title'] = env.content.replace(/&amp;/, '&');
			}
		});
	}
});
