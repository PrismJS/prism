Prism.languages.jolie = Prism.languages.extend('java', {
	'keyword': /(<-|=>)|\b(is_defined|undef|include|main|outputPort|inputPort|Location|Protocol|RequestResponse|throw|OneWay|interface|any|long|type|void|sequential|raw|scope|forward|install|execution|single|concurrent|Interfaces|cset|csets|double|global|linkIn|linkOut|string|bool|int|synchronized|courier|extender|throws|this|new|Interfaces|nullprocess|Redirects|embedded|extender|Aggregates|spawn|constants|with|foreach|instanceof|<-|over|define)\b/g,
	'builtin': /\b(string|int|long|Byte|bool|double|float|char|any)\b/g,
	'number': /\b0x[\da-f]*\.?[\da-f\-]+\b|\b\d*\.?\d+[e]?[\d]*[dfl]?\b/gi,
	'operator': /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|\||\*|\//g,
	'punctuation': /[{}[\]()\.:]/g,
	'operation': /[a-z][A-Za-z0-9_]+(?=\@)/gm,
	'service': {
		pattern: /((?:(?:\@\s*)))[A-Z][A-Za-z0-9_]+/ig,
		lookbehind: true,
	},
	'symbol': /\||;|\@/g,
	'string': /(""")[\W\w]*?\1|("|\/)[\W\w]*?\2|('.')/g
});
delete Prism.languages.jolie['class-name'];
delete Prism.languages.jolie['function'];