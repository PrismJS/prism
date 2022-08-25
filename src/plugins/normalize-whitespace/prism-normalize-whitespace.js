(function () {

	if (typeof Prism === 'undefined') {
		return;
	}

	const assign = Object.assign || function (obj1, obj2) {
		for (const name in obj2) {
			if (obj2.hasOwnProperty(name)) {
				obj1[name] = obj2[name];
			}
		}
		return obj1;
	};

	function NormalizeWhitespace(defaults) {
		this.defaults = assign({}, defaults);
	}

	function toCamelCase(value) {
		return value.replace(/-(\w)/g, (match, firstChar) => {
			return firstChar.toUpperCase();
		});
	}

	function tabLen(str) {
		let res = 0;
		for (let i = 0; i < str.length; ++i) {
			if (str.charCodeAt(i) == '\t'.charCodeAt(0)) {
				res += 3;
			}
		}
		return str.length + res;
	}

	const settingsConfig = {
		'remove-trailing': 'boolean',
		'remove-indent': 'boolean',
		'left-trim': 'boolean',
		'right-trim': 'boolean',
		'break-lines': 'number',
		'indent': 'number',
		'remove-initial-line-feed': 'boolean',
		'tabs-to-spaces': 'number',
		'spaces-to-tabs': 'number',
	};

	NormalizeWhitespace.prototype = {
		setDefaults(defaults) {
			this.defaults = assign(this.defaults, defaults);
		},
		normalize(input, settings) {
			settings = assign(this.defaults, settings);

			for (const name in settings) {
				const methodName = toCamelCase(name);
				if (name !== 'normalize' && methodName !== 'setDefaults' &&
					settings[name] && this[methodName]) {
					input = this[methodName].call(this, input, settings[name]);
				}
			}

			return input;
		},

		/*
		 * Normalization methods
		 */
		leftTrim(input) {
			return input.replace(/^\s+/, '');
		},
		rightTrim(input) {
			return input.replace(/\s+$/, '');
		},
		tabsToSpaces(input, spaces) {
			spaces = spaces|0 || 4;
			return input.replace(/\t/g, new Array(++spaces).join(' '));
		},
		spacesToTabs(input, spaces) {
			spaces = spaces|0 || 4;
			return input.replace(RegExp(' {' + spaces + '}', 'g'), '\t');
		},
		removeTrailing(input) {
			return input.replace(/\s*?$/gm, '');
		},
		// Support for deprecated plugin remove-initial-line-feed
		removeInitialLineFeed(input) {
			return input.replace(/^(?:\r?\n|\r)/, '');
		},
		removeIndent(input) {
			const indents = input.match(/^[^\S\n\r]*(?=\S)/gm);

			if (!indents || !indents[0].length) {
				return input;
			}

			indents.sort((a, b) => a.length - b.length);

			if (!indents[0].length) {
				return input;
			}

			return input.replace(RegExp('^' + indents[0], 'gm'), '');
		},
		indent(input, tabs) {
			return input.replace(/^[^\S\n\r]*(?=\S)/gm, new Array(++tabs).join('\t') + '$&');
		},
		breakLines(input, characters) {
			characters = (characters === true) ? 80 : characters|0 || 80;

			const lines = input.split('\n');
			for (let i = 0; i < lines.length; ++i) {
				if (tabLen(lines[i]) <= characters) {
					continue;
				}

				const line = lines[i].split(/(\s+)/g);
				let len = 0;

				for (let j = 0; j < line.length; ++j) {
					const tl = tabLen(line[j]);
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

	// Support node modules
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = NormalizeWhitespace;
	}

	Prism.plugins.NormalizeWhitespace = new NormalizeWhitespace({
		'remove-trailing': true,
		'remove-indent': true,
		'left-trim': true,
		'right-trim': true,
		/*'break-lines': 80,
		'indent': 2,
		'remove-initial-line-feed': false,
		'tabs-to-spaces': 4,
		'spaces-to-tabs': 4*/
	});

	Prism.hooks.add('before-sanity-check', (env) => {
		const Normalizer = Prism.plugins.NormalizeWhitespace;

		// Check settings
		if (env.settings && env.settings['whitespace-normalization'] === false) {
			return;
		}

		// Check classes
		if (!Prism.util.isActive(env.element, 'whitespace-normalization', true)) {
			return;
		}

		// Simple mode if there is no env.element
		if ((!env.element || !env.element.parentNode) && env.code) {
			env.code = Normalizer.normalize(env.code, env.settings);
			return;
		}

		// Normal mode
		const pre = env.element.parentNode;
		if (!env.code || !pre || pre.nodeName.toLowerCase() !== 'pre') {
			return;
		}

		if (env.settings == null) { env.settings = {}; }

		// Read settings from 'data-' attributes
		for (const key in settingsConfig) {
			if (Object.hasOwnProperty.call(settingsConfig, key)) {
				const settingType = settingsConfig[key];
				if (pre.hasAttribute('data-' + key)) {
					try {
						const value = JSON.parse(pre.getAttribute('data-' + key) || 'true');
						if (typeof value === settingType) {
							env.settings[key] = value;
						}
					} catch (_error) {
						// ignore error
					}
				}
			}
		}

		const children = pre.childNodes;
		let before = '';
		let after = '';
		let codeFound = false;

		// Move surrounding whitespace from the <pre> tag into the <code> tag
		for (let i = 0; i < children.length; ++i) {
			const node = children[i];

			if (node == env.element) {
				codeFound = true;
			} else if (node.nodeName === '#text') {
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
			env.code = Normalizer.normalize(env.code, env.settings);
		} else {
			// Preserve markup for keep-markup plugin
			const html = before + env.element.innerHTML + after;
			env.element.innerHTML = Normalizer.normalize(html, env.settings);
			env.code = env.element.textContent;
		}
	});

}());
