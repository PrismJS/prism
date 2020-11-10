// Thanks to: https://github.com/prometheus-community/monaco-promql/blob/master/src/promql/promql.ts
// As well as: https://kausal.co/blog/slate-prism-add-new-syntax-promql/

(function (Prism) {
	// PromQL Aggregation Operators
	// (https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators)
	var aggregations = [
		'sum',
		'min',
		'max',
		'avg',
		'group',
		'stddev',
		'stdvar',
		'count',
		'count_values',
		'bottomk',
		'topk',
		'quantile'
	];

	// PromQL functions
	// (https://prometheus.io/docs/prometheus/latest/querying/functions/)
	var functions = [
		'abs',
		'absent',
		'ceil',
		'changes',
		'clamp_max',
		'clamp_min',
		'day_of_month',
		'day_of_week',
		'days_in_month',
		'delta',
		'deriv',
		'exp',
		'floor',
		'histogram_quantile',
		'holt_winters',
		'hour',
		'idelta',
		'increase',
		'irate',
		'label_join',
		'label_replace',
		'ln',
		'log2',
		'log10',
		'minute',
		'month',
		'predict_linear',
		'rate',
		'resets',
		'round',
		'scalar',
		'sort',
		'sort_desc',
		'sqrt',
		'time',
		'timestamp',
		'vector',
		'year'
	];

	// PromQL specific functions: Aggregations over time
	// (https://prometheus.io/docs/prometheus/latest/querying/functions/#aggregation_over_time)
	aggregations.forEach(function (agg) {
		functions.push(agg + '_over_time');
	});

	// PromQL vector matching + the by and without clauses
	// (https://prometheus.io/docs/prometheus/latest/querying/operators/#vector-matching)
	var vectorMatching = [
		'on',
		'ignoring',
		'group_right',
		'group_left',
		'by',
		'without',
	];

	// PromQL offset modifier
	// (https://prometheus.io/docs/prometheus/latest/querying/basics/#offset-modifier)
	var offsetModifier = ['offset'];

	var keywords = aggregations.concat(vectorMatching, offsetModifier);

	Prism.languages.promql = {
		'comment': {
			pattern: /(^[ \t]*)#.*/m,
			lookbehind: true
		},
		'vector-match': {
			// Match the comma-separated label lists inside vector matching:
			pattern: new RegExp('((?:' + vectorMatching.join('|') + ')\\s*)\\([^)]*\\)'),
			lookbehind: true,
			inside: {
				'label-key': {
					pattern: /\b[^,]*\b/,
					alias: 'attr-name',
				},
				'punctuation': /[(),]/
			},
		},
		'context-labels': {
			pattern: /\{[^{}]*\}/,
			inside: {
				'label-key': {
					pattern: /\b[a-z_]\w*(?=\s*(?:=~?|![=~]))/,
					alias: 'attr-name',
				},
				'label-value': {
					pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/,
					greedy: true,
					alias: 'attr-value',
				},
				'punctuation': /\{|\}|=~?|![=~]|,/,
			},
		},
		'context-range': [
			{
				pattern: /\[[\w\s:]+\]/, // [1m]
				inside: {
					'punctuation': /\[|\]|:/,
					'range-duration': {
						pattern: /\b(?:\d+(?:[smhdwy]|ms))+\b/i,
						alias: 'number',
					},
				},
			},
			{
				pattern: /(\boffset\s+)\w+/, // offset 1m
				lookbehind: true,
				inside: {
					'range-duration': {
						pattern: /\b(?:\d+(?:[smhdwy]|ms))+\b/i,
						alias: 'number',
					},
				},
			},
		],
		'function': new RegExp('\\b(?:' + functions.join('|') + ')(?=\\s*\\()', 'i'),
		'keyword': new RegExp('\\b(?:' + keywords.join('|') + ')\\b', 'i'),
		'number': /[-+]?(?:(?:\b\d+(?:\.\d+)?|\B\.\d+)(?:e[-+]?\d+)?\b|\b(?:0x[0-9a-f]+|nan|inf)\b)/i,
		'operator': /[\^*/%+-]|==|!=|<=|<|>=|>|\b(?:and|unless|or)\b/i,
		'punctuation': /[{};()`,.[\]]/,
	};
})(Prism);
