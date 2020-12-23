(function (Prism) {

	var tag = Prism.languages.markup['tag'];

	// A general tag attribute.
	var TAG_ATTR = tag.TAG_ATTR;

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

	/**
	 * @typedef TagAttributes
	 * @property {string} attr
	 * @property {string | undefined} [before=""]
	 */

	/**
	 * @param {Attribute[]} attributes
	 * @returns {TagAttributes | undefined}
	 *
	 * @typedef Attribute
	 * @property {RegExp} name
	 * @property {RegExp} value
	 * @property {boolean} [optional=false]
	 */
	function specificAttr(attributes) {
		if (attributes.length === 0) {
			return undefined;
		}

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

		/**
		 * @param {Attribute} attr
		 */
		function getNameSource(attr) {
			return attr.name.source;
		}

		// Implement 1)
		var required = '';
		for (var attr, i = 0; attr = attributes[i++];) {
			if (!attr.optional) {
				required += '(?=(?:\\s*(?:' + TAG_ATTR + '))*?\\s*(?:' + getNameSource(attr) + ')\\s*=)';
			}
		}

		// Implement 2)
		var attrChoices = '(?!(?:' + attributes.map(getNameSource).join('|') + ')[\\s/>=])(?:' + TAG_ATTR + ')';
		for (var attr, i = 0; attr = attributes[i++];) {
			var value = replace(
				/\s*=\s*(?:"(?=<VALUE>")[^"]*"|'(?=<VALUE>')[^']*'|(?=<VALUE>[\s/>])[^\s'"/>=]+(?=[\s/>]))/.source,
				{ VALUE: attr.value.source }
			);
			attrChoices += '|' + getNameSource(attr) + value;
		}

		// create the new opening tag pattern
		return {
			attr: attrChoices,
			before: required
		};
	}

	Object.defineProperties(tag, {
		specificAttr: { value: specificAttr },
	});

	tag.addInlined('script', 'none', specificAttr([{ name: /type/, value: /text\/plain/ }]));

}(Prism));
