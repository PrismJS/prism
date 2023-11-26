export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['brainfuck']) {
      return
    }
	Prism.languages.brainfuck = {
		'pointer': {
			pattern: /<|>/,
			alias: 'keyword'
		},
		'increment': {
			pattern: /\+/,
			alias: 'inserted'
		},
		'decrement': {
			pattern: /-/,
			alias: 'deleted'
		},
		'branching': {
			pattern: /\[|\]/,
			alias: 'important'
		},
		'operator': /[.,]/,
		'comment': /\S+/
	};
}