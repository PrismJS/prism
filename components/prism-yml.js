Prism.languages.yml = {
	'boolean' : /\b(true|false)\b/g,
	'comment': /#[^\r\n]*(\r?\n|$)/g,
	'date': /\b\d{4}-\d{2}-\d{2}\b/g,
	'datetime': /\b\d{4}-\d{2}-\d{2}(T|t)\d{2}:\d{2}:\d{2}\b/g,
	'keyword': /(~|null)/g,
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+)\b/g,

	// attr-name has to be last or else datetime won't work and comments with ':' won't either
	'attr-name': /[a-zA-Z0-9_-]+\:/gi
};
