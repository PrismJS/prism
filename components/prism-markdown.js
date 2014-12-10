Prism.languages.markdown = Prism.languages.extend('markup', {
	'blockquote': {
		// > ...
		pattern: /(^|\n)>(?:[\t ]*>)*/,
		lookbehind: true,
		alias: 'operator'
	},
	'code': [
		{
			// Prefixed by 4 spaces or 1 tab
			pattern: /(^|\n)(?: {4}|\t).+/,
			lookbehind: true,
			alias: 'keyword'
		},
		{
			// `code`
			// ``code``
			pattern: /``.+?``|`[^`\n]+`/,
			alias: 'keyword'
		}
	],
	'title': [
		{
			// title 1
			// =======

			// title 2
			// -------
			pattern: /\w+.*\n(?:==+|--+)/,
			alias: 'important'
		},
		{
			// # title 1
			// ###### title 6
			pattern: /#+.+/,
			alias: 'important'
		}
	],
	'hr': {
		// ***
		// ---
		// * * *
		// -----------
		pattern: /([*-])([\t ]*\1){2,}/,
		alias: 'punctuation'
	},
	'list': {
		// * item
		// + item
		// - item
		// 1. item
		pattern: /(?:[*+-]|\d+\.)(?=[\t ].)/,
		alias: 'operator'
	},
	'link-reference': {
		// [id]: http://example.com "Optional title"
		// [id]: http://example.com 'Optional title'
		// [id]: http://example.com (Optional title)
		// [id]: <http://example.com> "Optional title"
		pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:[^>]|\\>)+>)(?:[\t ]+(?:"(?:[^"]|\\")*"|'(?:[^']|\\')*'|\((?:[^)]|\\\))*\)))?/,
		alias: 'symbol namespace'
	},
	'link': [
		{
			// [example](http://example.com "Optional title")
			pattern: /!?\[[^\]]+\]\([^\s)]+(?:[\t ]+"(?:[^"]|\\")*")?\)/,
			alias: 'symbol'
		},
		{
			// [example] [id]
			pattern: /!?\[[^\]]+\] ?\[[^\]\n]*\]/,
			alias: 'symbol'
		}
	],
	'strong': [
		{
			// **strong**
			// __strong__
			pattern: /(^|[^\\])\*\*[\s\S]+?\*\*/,
			lookbehind: true,
			alias: 'string'
		},
		{
			pattern: /(^|[^\\])__[\s\S]+?__/,
			lookbehind: true,
			alias: 'string'
		}
	],
	'em': [
		{
			// *em*
			pattern: /(^|[^\\])\*[^*\t ][^*]*\*/,
			lookbehind: true,
			alias: 'string'
		},
		{
			// _em_
			pattern: /(^|[^\\])_[^_]+_/,
			lookbehind: true,
			alias: 'string'
		}
	]
});