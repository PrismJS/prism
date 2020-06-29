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

Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
	/**
	 * Adds an inlined language to markup.
	 *
	 * An example of an inlined language is CSS with `<style>` tags.
	 *
	 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
	 * case insensitive.
	 * @param {string} lang The language key.
	 * @param {InlineAttribute[]} [attributes] An optional record of attributes that have to have a certain value.
	 * @param {string | string[]} [before] An optional list of languages. This inline language will be checked before
	 * the given languages.
	 * @example
	 * addInlined('style', 'css');
	 * addInlined('script', 'none', [{ name: 'type': value: /text\/plain/ }]);
	 *
	 * @typedef InlineAttribute
	 * @property {RegExp} name
	 * @property {RegExp} value
	 * @property {boolean} [optional=false]
	 */
	value: function addInlined(tagName, lang, attributes, before) {
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

		/**
		 * Replaces all occurrences of `<KEY>` with the value of `replacements[KEY]`.
		 *
		 * @param {string} string
		 * @param {string[] | Object<string, string>} replacements
		 * @returns {string}
		 */
		function replace(string, replacements) {
			return string.replace(/<(\w+)>/g, function (m, key) { return '(?:' + replacements[key] + ')'; });
		}

		// A general tag attribute.
		var TAG_ATTR = /[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>]))/.source;
		// The attribute loop of tags.
		// This will consume at least one attribute
		var TAG_ATTR_LOOP = replace(/(?:\s*<ATTR>)+/.source, { ATTR: TAG_ATTR });

		// We assume that the opening tag can have any attributes by default. If there are some conditions, then the
		// below code will just replace this value.
		var openingTag = replace(/<<TAG>(?:\s<LOOP>)?\s*>/.source, { TAG: tagName, LOOP: TAG_ATTR_LOOP });
		var closingTag = replace(/<\/<TAG>>/.source, { TAG: tagName });

		// Now for the tricky part: attributes.
		// We have to do two things: 1) guarantee that non-optional attributes are present and 2) of the attributes that
		// are present, we have to guarantee that they have the correct value.
		//
		// Implementing 1) is relatively easy. After the tag name, we add a lookahead for each non-optional attribute
		// checking that the attribute is present. (We do not check the value here.)
		//
		// Implementing 2) is harder. The basic loop that is used to consume markup attribute looks roughly like the
		// following. In the pseudo pattern, AN is a general pattern of an attribute name and AV is a general attribute
		// value:
		//   (\s+AN(=AV)?)*
		// What we need here, is a conditional, so we can treat our target attributes differently and to do this, we use
		// lookaheads again. In the following, AN<i> will i-th target attribute name and AV<i> will be the i-th
		// attribute value:
		//   (\s+(AN1=AV1|AN2=AV2|...|(?!AN1|AN2|...)AN(=AV)?))*

		if (attributes && attributes.length > 0) {

			// Implement 1)
			var required = '';
			for (var attr, i = 0; attr = attributes[i++];) {
				if (!attr.optional) {
					required += replace(/(?=<LOOP>?\s*<N>\s*=)/.source, {
						LOOP: TAG_ATTR_LOOP,
						N: attr.name.source
					});
				}
			}

			// Implement 2)
			var attrChoices = [
				// the base case
				replace(/(?!<NAMES>[\s/>=])<ATTR>/.source, {
					ATTR: TAG_ATTR,
					NAMES: attributes.map(function (a) { return a.name.source; }).join('|')
				})
			];
			for (var attr, i = 0; attr = attributes[i++];) {
				var choice = replace(
					/<NAME>\s*=\s*(?:"(?=<VALUE>")[^"]*"|'(?=<VALUE>')[^']*'|(?=<VALUE>[\s>])[^\s'">=]+(?=[\s>]))/.source,
					{ NAME: attr.name.source, VALUE: attr.value.source }
				);
				attrChoices.push(choice);
			}
			var attrLoop = replace(/(?:\s*<ATTR>)+/.source, { ATTR: attrChoices.join('|') });

			// create the new opening tag pattern
			if (required) {
				// we require at least one attribute, so the loop isn't optional
				openingTag = replace(/<<TAG>\s<REQ><LOOP>\s*>/.source, { TAG: tagName, REQ: required, LOOP: attrLoop });
			} else {
				// basically the same as the old one but with a different loop
				openingTag = replace(/<<TAG>(?:\s<LOOP>)?\s*>/.source, { TAG: tagName, LOOP: attrLoop });
			}
		}

		var pattern = '(' + openingTag + ')'
			+ /(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?/.source
			+ '(?=' + closingTag + ')';

		var token = {
			pattern: RegExp(pattern, 'i'),
			lookbehind: true,
			greedy: true,
			inside: inside
		};

		var beforeArray = before ? (Array.isArray(before) ? before : [before]) : [];
		/** @type {Array} */
		var existingTokens = Prism.languages.markup[tagName];
		if (!existingTokens) {
			var def = {};
			def[tagName] = [token];
			Prism.languages.insertBefore('markup', 'cdata', def);
		} else {
			var index = existingTokens.findIndex(function (t) {
				return beforeArray.some(function (b) { return ('language-' + b) in t.inside; });
			});
			if (index === -1) {
				existingTokens.push(token);
			} else {
				existingTokens.splice(index, 0, token);
			}
		}
	}
});

Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;

Prism.languages.xml = Prism.languages.extend('markup', {});
Prism.languages.ssml = Prism.languages.xml;
Prism.languages.atom = Prism.languages.xml;
Prism.languages.rss = Prism.languages.xml;

Prism.languages.markup.tag.addInlined('script', 'none', [{ name: /type/, value: /text\/plain/ }]);
