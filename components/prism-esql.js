var commands = [
	'DISSECT',
	'DROP',
	'ENRICH',
	'EVAL',
	'EXPLAIN',
	'FROM',
	'FULL JOIN',
	'GROK',
	'INLINESTATS',
	'JOIN',
	'KEEP',
	'LEFT JOIN',
	'LIMIT',
	'LOOKUP JOIN',
	'METRICS',
	'MV_EXPAND',
	'RENAME',
	'RIGHT JOIN',
	'ROW',
	'SHOW',
	'SORT',
	'STATS',
	'WHERE',
];

var functions = [
	'ABS',
	'ACOS',
	'ASIN',
	'ATAN',
	'ATAN2',
	'AVG',
	'BIT_LENGTH',
	'BUCKET',
	'BYTE_LENGTH',
	'CASE',
	'CATEGORIZE',
	'CBRT',
	'CEIL',
	'CIDR_MATCH',
	'COALESCE',
	'CONCAT',
	'COS',
	'COSH',
	'COUNT_DISTINCT',
	'COUNT',
	'DATE_DIFF',
	'DATE_EXTRACT',
	'DATE_FORMAT',
	'DATE_PARSE',
	'DATE_TRUNC',
	'E',
	'ENDS_WITH',
	'EXP',
	'FLOOR',
	'FROM_BASE64',
	'GREATEST',
	'HASH',
	'HYPOT',
	'IP_PREFIX',
	'LEAST',
	'LEFT',
	'LENGTH',
	'LOCATE',
	'LOG',
	'LOG10',
	'LTRIM',
	'MATCH',
	'MAX',
	'MEDIAN_ABSOLUTE_DEVIATION',
	'MEDIAN',
	'MIN',
	'MV_APPEND',
	'MV_AVG',
	'MV_CONCAT',
	'MV_COUNT',
	'MV_DEDUPE',
	'MV_FIRST',
	'MV_LAST',
	'MV_MAX',
	'MV_MEDIAN_ABSOLUTE_DEVIATION',
	'MV_MEDIAN',
	'MV_MIN',
	'MV_PERCENTILE',
	'MV_PSERIES_WEIGHTED_SUM',
	'MV_SLICE',
	'MV_SORT',
	'MV_SUM',
	'MV_ZIP',
	'NOW',
	'PERCENTILE',
	'PI',
	'POW',
	'QSTR',
	'REPEAT',
	'REPLACE',
	'REVERSE',
	'RIGHT',
	'ROUND',
	'RTRIM',
	'SIGNUM',
	'SIN',
	'SINH',
	'SPACE',
	'SPLIT',
	'SQRT',
	'ST_CENTROID_AGG',
	'ST_CONTAINS',
	'ST_DISJOINT',
	'ST_DISTANCE',
	'ST_ENVELOPE',
	'ST_EXTENT_AGG',
	'ST_INTERSECTS',
	'ST_WITHIN',
	'ST_X',
	'ST_XMAX',
	'ST_XMIN',
	'ST_Y',
	'ST_YMAX',
	'ST_YMIN',
	'STARTS_WITH',
	'STD_DEV',
	'SUBSTRING',
	'SUM',
	'TAN',
	'TANH',
	'TAU',
	'TO_BASE64',
	'TO_BOOLEAN',
	'TO_CARTESIANPOINT',
	'TO_CARTESIANSHAPE',
	'TO_DATE_NANOS',
	'TO_DATEPERIOD',
	'TO_DATETIME',
	'TO_DEGREES',
	'TO_DOUBLE',
	'TO_GEOPOINT',
	'TO_GEOSHAPE',
	'TO_INTEGER',
	'TO_IP',
	'TO_LONG',
	'TO_LOWER',
	'TO_RADIANS',
	'TO_STRING',
	'TO_TIMEDURATION',
	'TO_UNSIGNED_LONG',
	'TO_UPPER',
	'TO_VERSION',
	'TOP',
	'TRIM',
	'VALUES',
	'WEIGHTED_AVG',
];

var keywords = [
	'BY',
	'ASC',
	'DESC',
	'FIRST',
	'LAST',
	'ON',
	'WITH',
	'METADATA',
	'NULLS',
];

var namedBinaryOperators = [
	'AND',
	'OR',
	'IS',
	'IN',
	'AS',
	'LIKE',
	'RLIKE',
	'RLIKE',
	'WHERE',
];

Prism.languages.esql = {
	// Single line comment: // comment
	comment: {
		pattern: /(^|[^\\])\/\/.*/,
		greedy: true
	},

	// Slash-star multiline comments: /* comment */
	'multiline-comment': {
		pattern: /\/\*[\s\S]*?\*\//,
		greedy: true,
		alias: [
			'comment',
		]
	},

	// Triple quoted strings: """string"""
	'triple-quoted-string': {
		pattern: /"""(?:\\.|[^\\"])*"""/,
		greedy: true,
		alias: [
			'string',
		]
	},

	// Single quoted strings: "string"
	'string': {
		pattern: /"(?:\\.|[^\\"])*"/,
		greedy: true
	},

	// ES|LQ params: "?paramName", "?1", "?"
	variable: /\?\w{1,999}/,

	// Command names
	command: {
		pattern: new RegExp('\\b(?:' + commands.join('|') + ')\\b', 'i'),
		alias: [
			'keyword',
		],
	},

	// List of well known keywords
	keyword: {
		pattern: new RegExp('\\b(?:' + keywords.join('|') + ')\\b', 'i'),
	},


	'named-binary-operator': {
		pattern: new RegExp('\\b(?:' + namedBinaryOperators.join('|') + ')\\b', 'i'),
		alias: [
			'keyword',
		],
	},

	// Highlight list of known functions
	function: {
		pattern: new RegExp('\\b(?:' + functions.join('|') + ')\\b', 'i'),
	},

	boolean: /\b(?:false|true)\b/i,

	// Floating point numbers (ES|QL "decimals")
	float: {
		pattern: /\b(?:\d{1,50}\.{1}\d{0,50}|\.\d{1,50})(?:[eE][+-]?\d+)?\b/,
		alias: [
			'number'
		],
	},

	// Integer numbers
	integer: {
		pattern: /\b\d+\b/,
		alias: [
			'number'
		],
	},

	// Cast expressions
	cast: {
		pattern: /::\s*\w+\b/,
		alias: [
			'operator',
		],
	},

	// General operators
	operator: /-|\+|\*|\||\/|%|==|=|<=|>=|<|>/,

	// Mark "|" and "," and some other symbols as punctuation
	punctuation: /\||,|\(|\)|\[|\]|\{|\}/,
};
