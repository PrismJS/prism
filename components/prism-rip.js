Prism.languages.rip = {
	'comment': /#[^\r\n]*(\r?\n|$)/g,

	'builtin': /\b(@|System)\b/g,

	'boolean': /\b(true|false)\b/g,

	'date': /\b\d{4}-\d{2}-\d{2}\b/g,
	'time': /\b\d{2}:\d{2}:\d{2}\b/g,
	'datetime': /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\b/g,

	'number': /[+-]?(?:(?:\d+\.\d+)|(?:\d+))/g
};
