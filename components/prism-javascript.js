Prism.languages.javascript = {
	'comment': /\/\*[\w\W]*?\*\//g,
	'regex': /\/(\\?.)+?\/[gim]{0,3}/g,
	'line-comment': /\/\/.*?(\r?\n|$)/g,
	'string': /("|')(\\?.)*?\1/g,
	'keyword': /\b(var|let|if|else|while|do|for|return|in|instanceof|function|new|with|typeof|try|catch|finally|null|break|continue)\b/g,
	'boolean': /\b(true|false)\b/g,
	'number': /\b-?(0x)?\d*\.?\d+\b/g,
	'operator': /[-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|:/g,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[{}[\];(),.]/g
};