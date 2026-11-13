// RQL (Raven Query Language) is the SQL-like query language used by RavenDB, a document
// database. Queries written with RavenDB's high-level client APIs are translated into RQL
// under the hood, and RQL can also be written directly in the RavenDB Studio and via the
// low-level client API.
//
// Main reference: https://docs.ravendb.net/7.2/querying/rql/what-is-rql
//
// The keyword, function and operator lists below are derived from RavenDB's own production
// RQL tokenizer (the RavenDB Studio's query editor) and its ANTLR4 grammar (used by the
// Studio's autocomplete/syntax-check service), both in https://github.com/ravendb/ravendb.
//
// Not covered by this first version: the embedded JavaScript patch-script blocks that
// `select { ... }` and `update { ... }` open (see
// https://docs.ravendb.net/7.2/documents/patching-documents/overview) - those are highlighted
// as plain RQL text here rather than switching into a JavaScript sub-grammar.

/** @type {import('../types.d.ts').LanguageProto<'rql'>} */
export default {
	id: 'rql',
	grammar: {
		'comment': [
			{
				pattern: /\/\/.*/,
			},
			{
				pattern: /\/\*[\s\S]*?\*\//,
				greedy: true,
			},
		],
		'string': {
			pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`/,
			greedy: true,
		},
		'function': {
			// ai.task / embedding.* / vector.search are vector-search & AI functions added in
			// recent RQL versions: https://docs.ravendb.net/7.2/ai-integration/vector-search/start
			pattern:
				/\b(?:ai\.task|embedding\.(?:f32_i1|f32_i8|for|i1|i8|text|text_i1|text_i8)|vector\.search|boost|circle|contains|disjoint|endsWith|exact|exists|fuzzy|intersects|lucene|moreLikeThis|random|score|search|startsWith|within)\s*(?=\()/i,
		},
		'keyword':
			/\b(?:and|between|by|declare|facet|filter|filter_limit|from|function|group|in|include|index|limit|load|match|not|offset|or|order|select|timeseries|update|where|with)\b/i,
		'order-by-option':
			/\b(?:asc|ascending|desc|descending)\b/i,
		'nulls-order':
			/\bnulls\s+(?:first|last)\b/i,
		'type-cast':
			/\b(?:alphaNumeric|double|long|string)\b/i,
		'boolean': /\b(?:false|null|true)\b/i,
		'special-token': /@(?:all_docs|metadata)\b/,
		'number': /\b\d+(?:\.\d+)?\b/,
		'operator': /[<>=!]+|&&|\|\|/,
		'punctuation': /[{}[\];(),.:]/,
	},
};
