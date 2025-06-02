(function (Prism) {

	var boolExp = /\b(?:AND|NOT|OR|PROX)\b/i;
	var stringExp = /(?:"(?:\\[\s\S]|(?!")[^\\])*")/;
	var wordExp = /[^\s()=<>"\/]+/;
	var identifierExp = RegExp('(?:' + stringExp.source + '|' + wordExp.source + ')');

	var comparitorNamedExp = identifierExp;
	var comparitorSymbolExp = /(?:<>|[=><]=?)/;
	var comparitorExp = RegExp('(?:' + comparitorSymbolExp.source + '|' + comparitorNamedExp.source + ')');

	var modifierExp = RegExp('/\\s*' + identifierExp.source + '(?:\\s*' + comparitorSymbolExp.source + '\\s*' + identifierExp.source + ')?');
	var modifierListExp = RegExp('(?:\\s*' + modifierExp.source + ')*');

	var relationExp = RegExp(comparitorExp.source + modifierListExp.source);

	var modifier = {
		pattern: modifierExp,
		inside: {
			'modifier': {
				pattern: RegExp('(/\\s*)' + identifierExp.source),
				lookbehind: true,
				alias: 'property',
			},
			'value': {
				pattern: RegExp(identifierExp.source + '$'),
				alias: 'string',
			},
			'comparitor': {
				pattern: comparitorSymbolExp,
				alias: 'operator',
			},
			'punctuation': /\//,
		}
	};

	var searchClause = {
		pattern: RegExp('(?:' + identifierExp.source + '\\s*' + relationExp.source + '\\s*)?' + identifierExp.source),
		inside: {
			// required last part, search term
			'term': {
				pattern: RegExp(identifierExp.source + '(?!.)'),
				alias: 'string',
			},
			// optional index with relation
			'index': {
				pattern: RegExp('^' + identifierExp.source),
				alias: 'property',
			},
			'relation-modifier': modifier,
			'relation': {
				pattern: comparitorExp,
				alias: 'operator',
			},
		},
	};

	var boolClause = {
		pattern: RegExp(boolExp.source + modifierListExp.source, 'i'),
		inside: {
			'boolean': {
				pattern: boolExp,
				alias: 'operator'
			},
			'boolean-modifier': modifier,
		},
	};

	var prefix = {
		pattern: RegExp('(^\\s*)>\\s*(?:' + identifierExp.source + '\\s*=\\s*)?' + identifierExp.source),
		lookbehind: true,
		inside: {
			'uri': {
				pattern: RegExp(identifierExp.source + '$'),
				alias: 'string',
			},
			'prefix': {
				pattern: identifierExp,
				alias: 'property',
			},
			'punctuation': /[>=]/,
		}
	};

	var sortby = {
		// XXX: too complex exponential/polynomial backtracking possible ...
		//pattern: RegExp('sortby(?:\\s*' + identifierExp.source + modifierListExp.source + ')+\\s*$', 'i'),
		pattern: RegExp('(^|\\s)sortby\\b(?:' + identifierExp.source + '\\b|[\\s=></])+$', 'i'),
		lookbehind: true,
		inside: {
			'keyword': /sortby/i,
			'sortby-index-modifier': modifier,
			'index': {
				pattern: identifierExp,
				alias: 'property',
			}
		}
	};

	Prism.languages['cql'] = {
		// prefix / suffix
		'prefix': prefix,
		'sortby': sortby,

		// conjuctions
		'bool-group': boolClause,
		// search clause triples
		'search-clause': searchClause,

		// grouping
		'punctuation': /[()]/,
	};

}(Prism));
