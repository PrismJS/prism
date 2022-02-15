(function (Prism) {

	var ingr_cw_prefix = /(?:[@#][^{@#]+)\{/;
	var ingr_cw_suffix = /\}/;
	var quant1 = /(?:[^}|*%]*\*?)/;
	var quant_unit = /(?:[^}|*%]+\*?%[^}]+)/;
	var quant_servings_unit = /(?:(?:[^*}%|]+\|)+[^*}%|]+(?:%[^*|%}]+)?)/;

	Prism.languages.cooklang = {
		'comment': {
			// [- comment -]
			// -- comment
			pattern: /\[-[\s\S]*?-\]|--.*/,
			greedy: true
		},
		'meta': { // >> key: value
			'pattern': />{2}.*:.*/,
			'inside': {
				'property': { // key:
					pattern: /(>>\s*)[^\s:](?:[^:]*[^\s:])?/,
					lookbehind: true,
				}
			}
		},
		'quant': { // @some ingredient{...} #some cookware{...}
			'pattern': new RegExp(
				ingr_cw_prefix.source
				+ '(?:'
				+ quant1.source + '|'
				+ quant_unit.source + '|'
				+ quant_servings_unit.source
				+ ')'
				+ ingr_cw_suffix.source
			),
			'inside': {
				'variable': { // some ingredient, some cookware
					pattern: /([@#])[^{@#]+/,
					lookbehind: true
				},
				'amount-group': {
					'pattern': /\{[^{}]*\}/, // {...}
					'inside': {
						'punctuation': /[{}]/,
						'symbol': {  // unit
							'pattern': /(%)[^}]+/,
							'lookbehind': true
						},
						'operator': /\*%|\*|%|\|/, // already includes not yet officially implemented servings operators
						'number': /[^{}*%]+/, // amount
					}
				},
				'keyword': /[@#]/,
			}
		},
		'no-quant': { // ingredient, cookware
			'pattern': /[@#][^{@#\s]+/,
			'inside': {
				'keyword': /[@#]/,
				'variable': /[^{@#]+/
			}
		},
		'timer-group': { // ~timer{...}
			'pattern': /~[^{}]*\{\d+%(?:hours|minutes)\}/,
			'inside': {
				'variable': { // timer name
					pattern: /(~)[^{]+/,
					lookbehind: true
				},
				'duration-group': { // {...}
					'pattern': /\{[^{}]+\}/,
					'inside': {
						'punctuation': /[{}]/,
						'symbol': { // unit
							'pattern': /(%)(?:minutes|min|m|hours|hrs|h)/,
							'lookbehind': true
						},
						'operator': /%/,
						'number': /\d+/, // amount
					}
				},
				'keyword': /~/,
			}
		}
	};
}(Prism));
