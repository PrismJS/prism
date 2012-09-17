Prism.languages.python = {
	'comment': /#.*/,
	'string': /[ubr]?("|')(\\?.)*?\1/g,
	'keyword': /\bprint|return|if|else|elif|while|raise|try|except|finally|def|class|for|in|with|break|continue|lambda|yield|del|global|del|as|pass/,
	'boolean': /\b(True|False|None)\b/g,
	'number': /\b-?(0x)?\d*\.?\d+\b/g,
	'operator': /[-+]{1,2}|[!~]|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|{1,2}|\*|\/|\band\b|\bor\b|\bnot\b/g,
};

