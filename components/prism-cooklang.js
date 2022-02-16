(function (Prism) {

	var single_token_suffix = /[^{}@#\s]+/.source;
	var multi_token_infix = /[^{}@#]+/.source;
	var multi_token_suffix = /\{[^}#@]*\}/.source;

	var multi_token = multi_token_infix + multi_token_suffix;

	var timer_units = /(?:h|hours|hrs|m|min|minutes)/.source;

	var amount_group_impl = {
		pattern: new RegExp(/\{/.source
			+ '(?:(?:'
			+ /(?:[^{}|*%]+\*?)/.source // optional serving scale
			+ '|'
			+ /(?:(?:[^{}|*%]+\|)+[^{}|*%]+)/.source // serving alternatives
			+ ')' + /(?:%[^{}|*%]+)?/.source //optional unit
			+ ')?'
			+ /\}/.source
		),
		inside: {
			'amount': {
				pattern: /([\{|])[^{}|*%]+/,
				lookbehind: true,
				alias: 'number',
			},
			'unit': {
				pattern: /(%)[^}]+/,
				lookbehind: true,
				alias: 'symbol',
			},
			'servings-scaler': {
				pattern: /\*/,
				alias: 'operator',
			},
			'servings-alternative-seperator': {
				pattern: /\|/,
				alias: 'operator',
			},
			'unit-separator': {
				pattern: /(?:%|(\*)%)/,
				lookbehind: true,
				alias: 'operator',
			},
			'punctuation': /[{}]/,
		}
	};

	Prism.languages.cooklang = {
		'comment': {
			// [- comment -]
			// -- comment
			pattern: /\[-[\s\S]*?-\]|--.*/,
			greedy: true,
		},
		'meta': { // >> key: value
			pattern: />>.*:.*/,
			inside: {
				property: { // key:
					pattern: /(>>\s*)[^\s:](?:[^:]*[^\s:])?/,
					lookbehind: true,
				}
			}
		},
		'cookware-group': { // #...{...}, #...
			pattern: new RegExp('#(?:'
				+ multi_token
				+ '|'
				+ single_token_suffix
				+ ')'
			),
			inside: {
				'cookware': {
					pattern: new RegExp('(#)(?:'
						+ multi_token_infix
						+ ')'
					),
					lookbehind: true,
					alias: 'variable',
				},
				'cookware-keyword': {
					pattern: /^#/,
					alias: 'keyword',
				},
				'amount-group': amount_group_impl,
			},
		},
		'ingredient-group': { // @...{...}, @...
			pattern: new RegExp('@(?:'
				+ multi_token
				+ '|'
				+ single_token_suffix
				+ ')'),
			inside: {
				'ingredient': {
					pattern: new RegExp('(@)(?:'
						+ multi_token_infix
						+ ')'),
					lookbehind: true,
					alias: 'variable',
				},
				'ingredient-keyword': {
					pattern: /^@/,
					alias: 'keyword',
				},
				'amount-group': amount_group_impl
			}
		},
		'timer-group': { // ~timer{...}
			// eslint-disable-next-line regexp/sort-alternatives
			pattern: new RegExp(/~[^{}]*\{\d+%/.source + timer_units + /\}/.source),
			inside: {
				'timer': {
					pattern: /(~)[^{]+/,
					lookbehind: true,
					alias: 'variable',
				},
				'duration-group': { // {...}
					pattern: /\{[^{}]+\}/,
					inside: {
						'punctuation': /[{}]/,
						'unit': {
							// eslint-disable-next-line regexp/no-dupe-disjunctions
							pattern: new RegExp(/(%)/.source + timer_units),
							lookbehind: true,
							alias: 'symbol',
						},
						'operator': /%/,
						'duration': {
							pattern: /\d+/,
							alias: 'number',
						},
					}
				},
				'timer-keyword': {
					pattern: /^~/,
					alias: 'keyword',
				},
			}
		}
	};
}(Prism));
