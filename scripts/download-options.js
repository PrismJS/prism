/**
 * @typedef DownloadOption
 * @property {string} id All ids have to be unique and start with `options-`.
 * @property {string} title
 * @property {string|string[]} [require] A list of required components for this option to take effect.
 * @property {boolean} [enabled]
 * @property {Object<string, OptionItem>} items
 * @property {(this: DownloadOption, code: Code) => void} apply
 *
 * @typedef {StringOptionItem | NumberOptionItem | BooleanOptionItem} OptionItem
 *
 * @typedef StringOptionItem
 * @property {string} title
 * @property {"string"} type
 * @property {string} [value]
 * @property {string} [default='']
 * @property {Validator<string>} [validate]
 *
 * @typedef NumberOptionItem
 * @property {string} title
 * @property {"number"} type
 * @property {number} [value]
 * @property {number} [default=0]
 * @property {Validator<number>} [validate]
 *
 * @typedef BooleanOptionItem
 * @property {string} title
 * @property {"boolean"} type
 * @property {boolean} [value]
 * @property {boolean} [default=false]
 * @property {Validator<boolean>} [validate]
 *
 * @typedef Code
 * @property {string} js The current JavaScript code of the build.
 * @property {string} css The current CSS code of the build.
 */
/**
 * A function that validates the given value of the item it is the validator for.
 *
 * It returns `undefined` if the given value is valid, or a non-empty error message (HTML code) that will be displayed
 * to the user.
 *
 * @typedef {(value: T, option: DownloadOption) => string | undefined} Validator
 * @template T
 */

/** @type {DownloadOption[]} */
var downloadOptions = [];

(function () {
	/**
	 * Note: The keys of items are used as their identifier and will be be used in the URL hash.
	 *
	 * CHANGING OPTION IDS OR ITEM NAMES WILL BREAKING OLD URLS!
	 */

	addOption({
		id: 'options-general',
		title: 'General',
		items: {
			manual: {
				title: 'Manual highlighting',
				type: 'boolean'
			}
		},
		apply: function (code) {
			if (this.items.manual.value) {
				appendJs(code, 'Prism.manual=true;');
			}
		}
	});

	addOption({
		id: 'options-custom-class',
		title: 'Custom Class',
		require: 'custom-class',
		items: {
			prefix: {
				title: 'Theme prefix',
				type: 'string',
				validate: matchRegExp(/^(?:[a-z][\w-]*)?$/)
			}
		},
		apply: function (code) {
			var prefix = this.items.prefix.value;
			if (!prefix) {
				return;
			}

			// JS
			appendJs(code, 'Prism.plugins.customClass.prefix(' + JSON.stringify(prefix) + ');');

			// CSS
			var tokens = Prism.tokenize(code.css, Prism.languages.css);

			tokens.forEach(function (t) {
				if (t.type === 'selector') {
					var selector = stringify(t.content);

					selector = selector.replace(/[-\w.#:()]*\.token(?![-\w])[-\w.#:()]*/g, function (m) {
						return m.replace(/\.([\w-]+)/g, function (m, g1) {
							return '.' + prefix + g1;
						});
					});

					t.content = selector;
				}
			});

			/**
			 * @param {string | Token | Token[]} t
			 * @returns {string}
			 */
			function stringify(t) {
				if (typeof t === 'string') {
					return t;
				}
				if (Array.isArray(t)) {
					return t.map(stringify).join('');
				}
				return stringify(t.content);
			}

			code.css = stringify(tokens);
		}
	});

	addOption({
		id: 'options-filter-highlight-all',
		title: 'Filter highlightAll',
		require: 'filter-highlight-all',
		items: {
			filterKnown: {
				title: 'Filter known',
				type: 'boolean'
			},
			filterSelector: {
				title: 'Filter CSS selector',
				type: 'string'
			},
			rejectSelector: {
				title: 'Reject CSS selector',
				type: 'string'
			}
		},
		apply: function (code) {
			if (this.items.filterKnown.value) {
				appendJs(code, 'Prism.plugins.filterHighlightAll.filterKnown=true;');
			}
			var filterSelector = this.items.filterSelector.value;
			if (filterSelector) {
				appendJs(code, 'Prism.plugins.filterHighlightAll.addSelector(' + JSON.stringify(filterSelector) + ');');
			}
			var rejectSelector = this.items.rejectSelector.value;
			if (rejectSelector) {
				appendJs(code, 'Prism.plugins.filterHighlightAll.reject.addSelector(' + JSON.stringify(rejectSelector) + ');');
			}
		}
	});


	// --- HELPER FUNCTIONS ---


	/**
	 * This add the given option to the list of download option.
	 *
	 * @param {DownloadOption} option
	 */
	function addOption(option) {
		if (!/^options-/.test(option.id)) {
			throw new Error('Invalid id ' + option.id);
		}
		for (var name in option.items) {
			if (option.items.hasOwnProperty(name)) {
				if (!/^[\w-]+$/.test(name)) {
					throw new Error("Invalid name: " + name);
				}
				var element = option.items[name];
				element.validate = element.validate || voidFn;

				if (element.default == undefined) {
					if (element.type === 'boolean') {
						element.default = false;
					} else if (element.type === 'number') {
						element.default = 0;
					} else if (element.type === 'string') {
						element.default = '';
					}
				}

				if ('value' in element) {
					throw new Error('The "value" property cannot be defined here. Use "default" instead.');
				}
				element.value = element.default;

				// @ts-ignore
				if (element.validate(element.value, option)) {
					throw new Error('The default value of "' + name + '" has to be valid.');
				}
			}
		}
		downloadOptions.push(option);
	}

	function voidFn() { return undefined; }
	/**
	 * @param {RegExp} re
	 * @returns {Validator<string>}
	 */
	function matchRegExp(re) {
		return function (value) {
			if (!re.test(value)) {
				return 'The value must match the regular expression <code>' + text(re) + '</code>';
			}
		};
	}

	function text(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;');
	}

	/**
	 * Appends the given JavaScript statement to the given code.
	 *
	 * @param {Code} code
	 * @param {string} statement
	 */
	function appendJs(code, statement) {
		code.js = code.js + statement.replace(/;?\s*$/, ';\n');
	}
}());
