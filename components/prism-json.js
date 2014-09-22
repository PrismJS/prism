Prism.languages.json = {
	'property': /(\b|\B)[\w-]+(?=\s*:)/ig,
    'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
	'string': /("|')(?!:)(\\?[^'"])*?\1(?!:)/g,
	'punctuation': /[\{\};:]/g,
    'boolean': /\b(true|TRUE|false|FALSE)\b/g,
	'null': /\b(null|NULL)\b/g,
};