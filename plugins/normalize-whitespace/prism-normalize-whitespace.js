(function() {

if (typeof self === 'undefined' || !self.Prism || !self.document) {
	return;
}

function toCamelCase(value) {
	return value.replace(/-(\w)/g, function(match, firstChar) {
		return firstChar.toUpperCase();
	});
}

function tabLen(str) {
	var res = 0;
	for (var i = 0; i < str.length; ++i) {
		if (str.charCodeAt(i) == '\t'.charCodeAt(0))
			res += 3;
	}
	return str.length + res;
}

function NormalizeWhitespace() {
}

NormalizeWhitespace.prototype = {
	normalize: function (input, settings) {
		for (var name in settings) {
			var methodName = toCamelCase(name);
			if (settings[name] && this[methodName]) {
				input = this[methodName].call(this, input, settings[name]);
			}
		}

		return input;
	},

	/*
	 * Normalization methods
	 */
	leftTrim: function (input) {
		return input.replace(/^\s+/, '');
	},
	rightTrim: function (input) {
		return input.replace(/\s+$/, '');
	},
	tabsToSpaces: function (input, spaces) {
		return input.replace(/\t/g, new Array(++spaces).join(' '));
	},
	spacesToTabs: function (input, spaces) {
		return input.replace(new RegExp(' {' + spaces + '}', 'g'), '\t');
	},
	removeTrailing: function (input) {
		return input.replace(/\s*?$/gm, '');
	},
	// Support for deprecated plugin remove-initial-line-feed
	removeInitialLineFeed: function (input) {
		return input.replace(/^(?:\r?\n|\r)/, '');
	},
	removeIndent: function (input) {
		var indents = input.match(/^[^\S\n\r]*(?=\S)/gm);

		if (!indents || !indents[0].length)
			return input;

		indents.sort(function(a, b){return a.length - b.length; });

		if (!indents[0].length)
			return input;

		return input.replace(new RegExp('^' + indents[0], 'gm'), '');
	},
	indent: function (input, tabs) {
		return input.replace(/^[^\S\n\r]*(?=\S)/gm, new Array(++tabs).join('\t') + '$&');
	},
	breakLines: function (input, characters) {
		var lines = input.split('\n');
		for (var i = 0; i < lines.length; ++i) {
			if (tabLen(lines[i]) <= characters)
				continue;

			var line = lines[i].split(/(\s+)/g),
			    len = 0;

			for (var j = 0; j < line.length; ++j) {
				var tl = tabLen(line[j]);
				len += tl;
				if (len > characters) {
					line[j] = '\n' + line[j];
					len = tl;
				}
			}
			lines[i] = line.join('');
		}
		return lines.join('\n');
	}
};

Prism.plugins.NormalizeWhitespace = new NormalizeWhitespace();

Prism.hooks.add('before-highlight', function (env) {
	var settings = Prism.util.getSettings(env.element, {
		'remove-trailing': { type: 'bool', 'default': true },
		'remove-indent': { type: 'bool', 'default': true },
		'left-trim': { type: 'bool', 'default': true },
		'right-trim': { type: 'bool', 'default': true },
		'break-lines': { type: 'int' },
		'indent':  { type: 'int' },
		'remove-initial-line-feed': { type: 'bool' },
		'tabs-to-spaces': { type: 'int' },
		'spaces-to-tabs': { type: 'int' },
		'whitespace-normalization': { type: 'bool', 'default': true },
	});

	var pre = env.element.parentNode;
	if (!env.code || !pre || pre.nodeName.toLowerCase() !== 'pre' ||
			!settings['whitespace-normalization'])
		return;

	var children = pre.childNodes,
	    before = '',
	    after = '',
	    codeFound = false,
	    Normalizer = Prism.plugins.NormalizeWhitespace;

	// Move surrounding whitespace from the <pre> tag into the <code> tag
	for (var i = 0; i < children.length; ++i) {
		var node = children[i];

		if (node == env.element) {
			codeFound = true;
		} else if (node.nodeName === "#text") {
			if (codeFound) {
				after += node.nodeValue;
			} else {
				before += node.nodeValue;
			}

			pre.removeChild(node);
			--i;
		}
	}

	if (!env.element.children.length || !Prism.plugins.KeepMarkup) {
		env.code = before + env.code + after;
		env.code = Normalizer.normalize(env.code, settings);
	} else {
		// Preserve markup for keep-markup plugin
		var html = before + env.element.innerHTML + after;
		env.element.innerHTML = Normalizer.normalize(html, settings);
		env.code = env.element.textContent;
	}
});

}());