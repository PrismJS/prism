// Thanks to: https://github.com/prometheus-community/monaco-promql/blob/master/src/promql/promql.ts
// As well as: https://kausal.co/blog/slate-prism-add-new-syntax-promql/

// PromQL Aggregation Operators
// (https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators)
var aggregations = [
	"sum",
	"min",
	"max",
	"avg",
	"group",
	"stddev",
	"stdvar",
	"count",
	"count_values",
	"bottomk",
	"topk",
	"quantile",
];

// PromQL functions
// (https://prometheus.io/docs/prometheus/latest/querying/functions/)
var functions = [
	"abs",
	"absent",
	"ceil",
	"changes",
	"clamp_max",
	"clamp_min",
	"day_of_month",
	"day_of_week",
	"days_in_month",
	"delta",
	"deriv",
	"exp",
	"floor",
	"histogram_quantile",
	"holt_winters",
	"hour",
	"idelta",
	"increase",
	"irate",
	"label_join",
	"label_replace",
	"ln",
	"log2",
	"log10",
	"minute",
	"month",
	"predict_linear",
	"rate",
	"resets",
	"round",
	"scalar",
	"sort",
	"sort_desc",
	"sqrt",
	"time",
	"timestamp",
	"vector",
	"year",
];
  
// PromQL specific functions: Aggregations over time
// (https://prometheus.io/docs/prometheus/latest/querying/functions/#aggregation_over_time)
var aggregationsOverTime = [];
aggregations.forEach(function(agg) {
	aggregationsOverTime.push(agg + "_over_time");
});
  
// PromQL vector matching + the by and without clauses
// (https://prometheus.io/docs/prometheus/latest/querying/operators/#vector-matching)
var vectorMatching = [
	"on",
	"ignoring",
	"group_right",
	"group_left",
	"by",
	"without",
];
  
// PromQL Operators
// (https://prometheus.io/docs/prometheus/latest/querying/operators/)
var operators = [
	"\\+",
	"-",
	"\\*",
	"/",
	"%",
	"\\^",
	"==",
	"!=",
	">",
	"<",
	">=",
	"<=",
	"and",
	"or",
	"unless",
];

// PromQL offset modifier
// (https://prometheus.io/docs/prometheus/latest/querying/basics/#offset-modifier)
var offsetModifier = ["offset"];

// Merging all the keywords in one list
var keywords = aggregations
	.concat(functions)
	.concat(aggregationsOverTime)
	.concat(vectorMatching)
	.concat(offsetModifier);
  
Prism.languages.promql = {
	comment: {
		pattern: /^\s*#.*/m,
	},
	"context-aggregation": {
		pattern: new RegExp("((?:" + vectorMatching.join("|") + ")\\s*)\\([^)]*\\)"),
		lookbehind: true,
		inside: {
			"label-key": {
				pattern: /\b[^,]*\b/,
				alias: "attr-name",
			},
		},
	},
	"context-labels": {
		pattern: /\{[^}]*\}/,
		inside: {
			"label-key": {
				pattern: /[a-z_]\w*(?=\s*(?:=~?|![=~]))/,
				alias: "attr-name",
			},
			"label-value": {
				pattern: /"(?:\\.|[^\\"])*"/,
				alias: "attr-value",
			},
			punctuation: /\{|\}|=~?|![=~]/,
		},
	},
	function: new RegExp("\\b(?:" + keywords.join("|") + ")(?=\\s*\\()", "i"),
	"context-range": [
		{
			pattern: /\[[^\]]*\]/, // [1m]
			inside: {
				punctuation: /\[|\]/,
				"range-duration": {
					pattern: /\b\d+[smhdwy]\b/i,
					alias: "number",
				},
			},
		},
		{
			pattern: /(offset\s+)\w+/, // offset 1m
			lookbehind: true,
			inside: {
				"range-duration": {
					pattern: /\b\d+[smhdwy]\b/i,
					alias: "number",
				},
			},
		},
	],
	number: /-?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/,
	operator: new RegExp(
		"/[-+/%^*~]|=~?|![=~]|&&?|(?:\\|\\|?)|!=?|<(?:=>?|<|>)?|>[>=]?|\\b(?:" +
		operators.join("|") +
		")\\b",
		"i"
	),
	punctuation: /[{};()`,.[\]]/,
};
  