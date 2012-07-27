Prism.languages.javascript = {
	'comment': /\/\*[\w\W]*?\*\//g,
	'line-comment': {
		pattern: /(^|[^\\])\/\/.*?(\r?\n|$)/g,
		lookbehind: true
	},
	'string': /("|')(\\?.)*?\1/g,
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}/g,
		lookbehind: true
	},
	'keyword': /\b(var|let|if|else|while|do|for|return|in|instanceof|function|new|with|typeof|try|catch|finally|null|break|continue)\b/g,
	'boolean': /\b(true|false)\b/g,
	'number': /\b-?(0x)?\d*\.?\d+\b/g,
	'operator': /[-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\//g,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[{}[\];(),.:]/g
};