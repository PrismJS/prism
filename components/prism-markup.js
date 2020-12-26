(function (Prism) {

	// A general tag attribute.
	var TAG_ATTR = /[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'"/>=]+(?=[\s/>]))|(?=[\s/>]))/.source;

	Prism.languages.markup = {
		'comment': /<!--[\s\S]*?-->/,
		'prolog': /<\?[\s\S]+?\?>/,
		'doctype': {
			// https://www.w3.org/TR/xml/#NT-doctypedecl
			pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
			greedy: true,
			inside: {
				'internal-subset': {
					pattern: /(\[)[\s\S]+(?=\]>$)/,
					lookbehind: true,
					greedy: true,
					inside: null // see below
				},
				'string': {
					pattern: /"[^"]*"|'[^']*'/,
					greedy: true
				},
				'punctuation': /^<!|>$|[[\]]/,
				'doctype-tag': /^DOCTYPE/,
				'name': /[^\s<>'"]+/
			}
		},
		'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
		'tag': {
			pattern: RegExp(/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*<TAG>)+)?\s*\/?>/.source.replace(/<TAG>/g, function () { return TAG_ATTR; })),
			greedy: true,
			inside: {
				'tag': {
					pattern: /^<\/?[^\s>\/]+/,
					inside: {
						'punctuation': /^<\/?/,
						'namespace': /^[^\s>\/:]+:/
					}
				},
				'attr-value': {
					pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
					inside: {
						'punctuation': [
							{
								pattern: /^=/,
								alias: 'attr-equals'
							},
							/"|'/
						]
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
		'entity': [
			{
				pattern: /&[\da-z]{1,8};/i,
				alias: 'named-entity'
			},
			/&#x?[\da-f]{1,8};/i
		]
	};

	Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
		Prism.languages.markup['entity'];
	Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup;

	// Plugin to make entity title show the real entity, idea by Roman Komarov
	Prism.hooks.add('wrap', function (env) {
		if (env.type === 'entity') {
			env.attributes['title'] = env.content.replace(/&amp;/, '&');
		}
	});


	/**
	 * Adds an inlined language to markup.
	 *
	 * An example of an inlined language is CSS with `<style>` tags.
	 *
	 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
	 * case insensitive.
	 * @param {string} lang The language key.
	 * @param {TagAttributes} [attributes] An optional record of attributes that have to have a certain value.
	 * @param {string[]} [before] An optional list of languages. This inline language will be checked before
	 * the given languages.
	 * @example
	 * addInlined('style', 'css');
	 * addInlined('script', 'none', specificAttr([{ name: 'type': value: /text\/plain/ }]));
	 *
	 * @typedef TagAttributes
	 * @property {string} attr
	 * @property {string | undefined} [before=""]
	 */
	function addInlined(tagName, lang, attributes, before) {
		var includedCdataInside = {};
		includedCdataInside['language-' + lang] = {
			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
			lookbehind: true,
			inside: Prism.languages[lang]
		};
		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

		var inside = {
			'included-cdata': {
				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
				inside: includedCdataInside
			}
		};
		inside['language-' + lang] = {
			pattern: /[\s\S]+/,
			inside: Prism.languages[lang]
		};

		attributes = attributes || { attr: TAG_ATTR };

		// /<<TAG><BEFORE>(\s(\s*<ATTR>)+)?\s*>/
		var openingTag = '<'
			+ tagName // <TAG>
			+ '(?:' + (attributes.before || '') + ')' // <BEFORE>
			+ '(?:\\s(?:\\s*(?:' + attributes.attr + '))+)?' // (\s(\s*<ATTR>)+)?
			+ '\\s*>';
		var closingTag = '</' + tagName + '>';

		var pattern = '(' + openingTag + ')'
			+ /(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?/.source
			+ '(?=' + closingTag + ')';

		var token = {
			pattern: RegExp(pattern, 'i'),
			lookbehind: true,
			greedy: true,
			inside: inside
		};

		/** @type {Array} */
		var existingTokens = Prism.languages.markup[tagName];
		if (!existingTokens) {
			// no existing tokens, so we can just insert the new one before 'cdata'
			var def = {};
			def[tagName] = [token];
			Prism.languages.insertBefore('markup', 'cdata', def);
		} else {
			// there are some existing tokens for this tag.
			var index = existingTokens.length;
			if (before) {
				// instead of appending this token, we might want to insert it before some existing ones
				for (var i = 0, t; t = existingTokens[i++];) {
					if (before.some(function (b) { return ('language-' + b) in t.inside; })) {
						index = i;
						break;
					}
				}
			}
			existingTokens.splice(index, 0, token);
		}
	}

	Object.defineProperties(Prism.languages.markup['tag'], {
		addInlined: { value: addInlined },
		TAG_ATTR: { value: TAG_ATTR },
	});

	Prism.languages.html = Prism.languages.mathml = Prism.languages.svg = Prism.languages.markup;

	Prism.languages.rss = Prism.languages.atom = Prism.languages.ssml = Prism.languages.xml = Prism.languages.extend('markup', {});

}(Prism));
