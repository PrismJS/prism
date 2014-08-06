Prism.languages.latex = {
	'comment': /%[\w\W]*/g,
	'string': /(\$)(\\?.)*?\1/g,
	'punctuation': /[\{\}]/g,
	'selector': /[\\][a-zA-Z;,:\.]*/g
}