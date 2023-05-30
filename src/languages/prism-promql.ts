import type { LanguageProto } from '../types';

export default {
	id: 'promql',
	grammar() {
		// Thanks to: https://github.com/prometheus-community/monaco-promql/blob/master/src/promql/promql.ts
		// As well as: https://kausal.co/blog/slate-prism-add-new-syntax-promql/

		// PromQL Aggregation Operators
		// (https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators)
		const aggregations = [
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

		// PromQL vector matching + the by and without clauses
		// (https://prometheus.io/docs/prometheus/latest/querying/operators/#vector-matching)
		const vectorMatching = [
			'on',
			'ignoring',
			'group_right',
			'group_left',
			'by',
			'without',
		];

		// PromQL offset modifier
		// (https://prometheus.io/docs/prometheus/latest/querying/basics/#offset-modifier)
		const offsetModifier = ['offset'];

		const keywords = aggregations.concat(vectorMatching, offsetModifier);

		return {
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
						pattern: /\b[^,]+\b/,
						alias: 'attr-name',
					},
					'punctuation': /[(),]/
				},
			},
			'context-labels': {
				pattern: /\{[^{}]*\}/,
				inside: {
					'label-key': {
						pattern: /\b[a-z_]\w*(?=\s*(?:=|![=~]))/,
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
			'keyword': new RegExp('\\b(?:' + keywords.join('|') + ')\\b', 'i'),
			'function': /\b[a-z_]\w*(?=\s*\()/i,
			'number': /[-+]?(?:(?:\b\d+(?:\.\d+)?|\B\.\d+)(?:e[-+]?\d+)?\b|\b(?:0x[0-9a-f]+|nan|inf)\b)/i,
			'operator': /[\^*/%+-]|==|!=|<=|<|>=|>|\b(?:and|or|unless)\b/i,
			'punctuation': /[{};()`,.[\]]/,
		};
	}
} as LanguageProto<'promql'>;
