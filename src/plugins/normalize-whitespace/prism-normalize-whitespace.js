import { noop } from '../../shared/util.js';

export default /** @type {import("../../types").PluginProto} */ ({
	id: 'normalize-whitespace',
	optional: 'unescaped-markup',
	plugin(Prism) {
		return {}; // TODO:
	},
	effect(Prism) {
		/**
		 * @param {string} str
		 */
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

		/**
		 * @typedef {{
		 *   'break-lines': number,
		 *   'indent': number,
		 *   'left-trim': boolean,
		 *   'remove-indent': boolean,
		 *   'remove-initial-line-feed': boolean,
		 *   'remove-trailing': boolean,
		 *   'right-trim': boolean,
		 *   'spaces-to-tabs': number,
		 *   'tabs-to-spaces': number,
		 * }} NormalizeWhitespaceDefaults
		 */

		/**
		 * @type {readonly (keyof NormalizeWhitespaceDefaults)[]}
		 */
		const normalizationOrder = [
			'remove-trailing',
			'remove-indent',
			'left-trim',
			'right-trim',
			'break-lines',
			'indent',
			'remove-initial-line-feed',
			'tabs-to-spaces',
			'spaces-to-tabs',
		];

		/**
		 * @type {{ [K in keyof NormalizeWhitespaceDefaults]: (input: string, value: NormalizeWhitespaceDefaults[K]) => string }}
		 */
		const normalizationMethods = {
			'left-trim': (input) => input.replace(/^\s+/, ''),
			'right-trim': (input) => input.replace(/\s+$/, ''),
			'tabs-to-spaces': (input, spaces) => input.replace(/\t/g, ' '.repeat(spaces)),
			'spaces-to-tabs': (input, spaces) => input.replace(RegExp(' {' + spaces + '}', 'g'), '\t'),
			'remove-trailing': (input) => input.replace(/\s*?$/gm, ''),
			'remove-initial-line-feed': (input) => input.replace(/^(?:\r?\n|\r)/, ''),
			'remove-indent': (input) => {
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
			'indent': (input, tabs) => input.replace(/^[^\S\n\r]*(?=\S)/gm, '\t'.repeat(tabs) + '$&'),
			'break-lines': (input, characters) => {
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

		class NormalizeWhitespace {
			/**
			 * @param {Partial<Readonly<NormalizeWhitespaceDefaults>>} defaults
			 */
			constructor(defaults) {
				/**
				 * @type {Partial<NormalizeWhitespaceDefaults>}
				 */
				this.defaults = { ...defaults };
			}

			/**
			 * @param {Partial<Readonly<NormalizeWhitespaceDefaults>>} defaults
			 */
			setDefaults(defaults) {
				Object.assign(this.defaults, defaults);
			}

			/**
			 * @param {string} input
			 * @param {Partial<Readonly<NormalizeWhitespaceDefaults>>} settings
			 */
			normalize(input, settings) {
				settings = { ...this.defaults, ...settings };

				for (const name of normalizationOrder) {
					const value = settings[name];
					if (value !== undefined && value !== false) {
						input = normalizationMethods[name](input, /** @type {never} */ (value));
					}
				}

				return input;
			}
		}


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
	}
});
