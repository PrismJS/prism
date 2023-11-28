/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['gettext']) {
      return
    }
	Prism.languages.gettext = {
		'comment': [
			{
				pattern: /# .*/,
				greedy: true,
				alias: 'translator-comment'
			},
			{
				pattern: /#\..*/,
				greedy: true,
				alias: 'extracted-comment'
			},
			{
				pattern: /#:.*/,
				greedy: true,
				alias: 'reference-comment'
			},
			{
				pattern: /#,.*/,
				greedy: true,
				alias: 'flag-comment'
			},
			{
				pattern: /#\|.*/,
				greedy: true,
				alias: 'previously-untranslated-comment'
			},
			{
				pattern: /#.*/,
				greedy: true
			},
		],
		'string': {
			pattern: /(^|[^\\])"(?:[^"\\]|\\.)*"/,
			lookbehind: true,
			greedy: true
		},
		'keyword': /^msg(?:ctxt|id|id_plural|str)\b/m,
		'number': /\b\d+\b/,
		'punctuation': /[\[\]]/
	};

	Prism.languages.po = Prism.languages.gettext;
}