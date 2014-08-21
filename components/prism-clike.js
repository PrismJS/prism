Prism.languages.clike = {
	'comment': {
		pattern: /\/\*[\w\W]*?\*\/|\/\/.*/g,
		checkMatch: function(match, lastIndex) {
			var inDoubleQuote = !!this.inDoubleQuote,
				inSingleQuote = !!this.inSingleQuote,
				inRegex = !!this.inRegex,
				isEscaped = !!this.isEscaped,
				i = lastIndex || 0,
				str = match.input,
				len = match.index;

			for (; i < len; ++i) {
				switch(str.charCodeAt(i)) {
					case 34: /* " */
						inDoubleQuote = (!inDoubleQuote || isEscaped) &&
										!inSingleQuote &&
										!inRegex;
						break;
					case 39: /* ' */
						inSingleQuote = !inDoubleQuote &&
										(!inSingleQuote || isEscaped) &&
										!inRegex;
						break;
					case 47: /* / */
						inRegex = !inDoubleQuote &&
									!inSingleQuote &&
									(!inRegex || isEscaped);
						break;
					case 10: /* \n */
						inRegex = false;
						break;
					case 92: /* \ */
						isEscaped = !isEscaped;
						break;
					default:
						isEscaped = false;
				}
			}

			this.inDoubleQuote = inDoubleQuote;
			this.inSingleQuote = inSingleQuote;
			this.inRegex = inRegex;
			this.isEscaped = isEscaped;
			return !inDoubleQuote && !inSingleQuote && !inRegex;
		}
	},
	'string': /("|')(\\?.)*?\1/g,
	'class-name': {
		pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/ig,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
	'boolean': /\b(true|false)\b/g,
	'function': {
		pattern: /[a-z0-9_]+\(/ig,
		inside: {
			punctuation: /\(/
		}
	},
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
	'operator': /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[{}[\];(),.:]/g
};
