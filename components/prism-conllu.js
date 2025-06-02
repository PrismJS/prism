(function (Prism) {

	Prism.languages.conllu = {
		// comment lines
		comment: {
			pattern: /#(?:[^\n])*/,
			inside: {
				metadata: {
					pattern: /(?:\w+)\s*=\s*.*/,
					inside: {
						key: {
							pattern: /\w+(?=\s*=)/,
							alias: 'property',
						},
						value: {
							pattern: /(\s*=\s*)\S.*$/,
							lookbehind: true,
							alias: 'string',
						},
						operator: /[=]/,
					}
				},
				punctuation: /^#/,
			}
		},
		// separator between two sentence blocks
		"sentence-separator": {
			pattern: /(\r?\n)(?=\r?\n)/s,
			lookbehind: true,
		},
		// word lines
		token: {
			pattern: /.+/,
			inside: {
				id: {
					pattern: /^\d+(?:[.-]\d+)?/,
					alias: 'number',
				},
				// form / lemma / upos / xpos / feats / head / deprel / deps / misc
				value: {
					pattern: /^(\t)[^\t]*(?=\t|$)/,
					lookbehind: true,
					// alias: 'string',
					// inside: {
					// 	unspecified: /_/,
					// }
				},
			},
		},
	};

	const featKeyExp = /[A-Z][A-Za-z0-9]*(?:\[[a-z0-9]+\])?/;
	const featValueExp = /.+/; // we just want everything here ... not /[A-Z0-9][A-Za-z0-9]*/;
	const featsGrammar = {
		punctuation: /\|/,
		feature: {
			pattern: RegExp('^' + featKeyExp.source + '=' + '.*' + '$'),
			inside: {
				key: {
					pattern: RegExp(featKeyExp.source + '(?==)'), // /\w+(?==)/,
					alias: 'property',
				},
				value: [
					{
						pattern: /(=)(?:yes|no)$/i,
						lookbehind: true,
						alias: 'boolean',
					}, {
						pattern: RegExp('(=)' + featValueExp.source + '$'), // /(=).+$/,
						lookbehind: true,
						alias: 'string',
					}
				],
				operator: /=/,
			},
		},
	};

	const relationExp = /^[a-z]+(:[a-z]+)?(:[\p{Ll}\p{Lm}\p{Lo}\p{M}]+(_[\p{Ll}\p{Lm}\p{Lo}\p{M}]+)*)?(:[a-z]+)?$/;
	const depsGrammar = {
		punctuation: /\|/,
		dep: {
			pattern: /^\S+$/,
			inside: {
				head: {
					pattern: /\d+(?=:)/,
					alias: 'number',
				},
				punctuation: /^:/,
				relation: {
					pattern: /.+/, // we just capture everything, should be ok
					alias: 'symbol',
				},
			}
		},
	}

	// hook to assign roles to value fields
	const entryTypes = ['form', 'lemma', 'upos', 'xpos', 'feats', 'head', 'deprel', 'deps', 'misc'];
	const entryTypesAlias = [null, null, 'symbol', 'symbol', null, 'number', 'symbol', null, null];
	const entryTypeInside = [null, null, null, null, featsGrammar, null, null, depsGrammar, featsGrammar];
	Prism.hooks.add('after-tokenize', function (env) {
		if (env.language !== 'conllu') {
			return;
		}

		for (const row of env.tokens) {
			// go over each token row (if it is a "token" and not a comment/sentence-separator)
			if (row.type === 'token') {
				let entryTypeCounter = 0;
				for (const field of row.content) {
					// skip space between
					if (typeof field === 'string') { continue; }
					// only fields, not ids
					if (field?.type !== 'value') { continue; }

					if (field.alias === undefined) { field.alias = []; }
					if (typeof field.alias === 'string') { field.alias = [field.alias]; }

					// check if "_" value, and assign class
					if (field.content === '_') {
						field.alias.push('unspecified');
					}

					// assign role to value based on position
					if (entryTypeCounter < entryTypes.length) {
						// add "value" as one alias
						field.alias.push(field.type);
						// change field type
						field.type = entryTypes[entryTypeCounter];
						// add alias if available
						if (entryTypesAlias[entryTypeCounter] !== null) {
							field.alias.push(entryTypesAlias[entryTypeCounter]);
						} else if (entryTypeInside[entryTypeCounter] === null) {
							// only assign string if there is no inner processing?
							field.alias.push('string');
						}

						// run inner processing only for selected types!
						if (field.content !== '_' && entryTypeInside[entryTypeCounter] !== null) {
							field.content = Prism.tokenize(field.content, entryTypeInside[entryTypeCounter]);
						}
					}

					entryTypeCounter++;
				}
			}
		}
	});

	// just to have the classes listed on /faq.html#how-do-i-know-which-tokens-i-can-style-for
	// insert dummy rules that do not match anything
	// TODO: unsure about possible performance hit? - there should not be anything left to match but regex matching steps increase linearly with input string length ...
	// for (let index = 0; index < entryTypes.length; index++) {
	// 	const entryType = entryTypes[index];
	// 	const entryTypeAlias = entryTypesAlias[index];
	// 	const name = 'value.' + entryType + (entryTypeAlias !== null ? '.' + entryTypeAlias : '');
	// 	// use some invalid pattern
	// 	Prism.languages.conllu.token.inside[name] = /\b\B/;
	// }

}(Prism));
