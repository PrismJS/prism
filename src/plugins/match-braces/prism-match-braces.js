import { noop } from '../../shared/util.js';

export default /** @type {import("../../types").PluginProto} */ ({
	id: 'match-braces',
	plugin(Prism) {
		return {}; // TODO:
	},
	effect(Prism) {
		if (typeof document === 'undefined') {
			return noop;
		}

		function mapClassName(name) {
			const customClass = Prism.plugins.customClass;
			if (customClass) {
				return customClass.apply(name, 'none');
			} else {
				return name;
			}
		}

		const PARTNER = {
			'(': ')',
			'[': ']',
			'{': '}',
		};

		// The names for brace types.
		// These names have two purposes: 1) they can be used for styling and 2) they are used to pair braces. Only braces
		// of the same type are paired.
		const NAMES = {
			'(': 'brace-round',
			'[': 'brace-square',
			'{': 'brace-curly',
		};

		// A map for brace aliases.
		// This is useful for when some braces have a prefix/suffix as part of the punctuation token.
		const BRACE_ALIAS_MAP = {
			'${': '{', // JS template punctuation (e.g. `foo ${bar + 1}`)
		};

		const LEVEL_WARP = 12;

		let pairIdCounter = 0;

		const BRACE_ID_PATTERN = /^(pair-\d+-)(close|open)$/;

		/**
		 * Returns the brace partner given one brace of a brace pair.
		 *
		 * @param {HTMLElement} brace
		 * @returns {HTMLElement}
		 */
		function getPartnerBrace(brace) {
			const match = BRACE_ID_PATTERN.exec(brace.id);
			return document.querySelector('#' + match[1] + (match[2] == 'open' ? 'close' : 'open'));
		}

		/**
		 * @this {HTMLElement}
		 */
		function hoverBrace() {
			if (!Prism.util.isActive(this, 'brace-hover', true)) {
				return;
			}

			[this, getPartnerBrace(this)].forEach((e) => {
				e.classList.add(mapClassName('brace-hover'));
			});
		}
		/**
		 * @this {HTMLElement}
		 */
		function leaveBrace() {
			[this, getPartnerBrace(this)].forEach((e) => {
				e.classList.remove(mapClassName('brace-hover'));
			});
		}
		/**
		 * @this {HTMLElement}
		 */
		function clickBrace() {
			if (!Prism.util.isActive(this, 'brace-select', true)) {
				return;
			}

			[this, getPartnerBrace(this)].forEach((e) => {
				e.classList.add(mapClassName('brace-selected'));
			});
		}

		Prism.hooks.add('complete', (env) => {

			/** @type {HTMLElement} */
			const code = env.element;
			const pre = code.parentElement;

			if (!pre || pre.tagName != 'PRE') {
				return;
			}

			// find the braces to match
			/** @type {string[]} */
			const toMatch = [];
			if (Prism.util.isActive(code, 'match-braces')) {
				toMatch.push('(', '[', '{');
			}

			if (toMatch.length == 0) {
				// nothing to match
				return;
			}

			if (!pre.__listenerAdded) {
				// code blocks might be highlighted more than once
				pre.addEventListener('mousedown', () => {
					// the code element might have been replaced
					const code = pre.querySelector('code');
					const className = mapClassName('brace-selected');
					Array.prototype.slice.call(code.querySelectorAll('.' + className)).forEach((e) => {
						e.classList.remove(className);
					});
				});
				Object.defineProperty(pre, '__listenerAdded', { value: true });
			}

			/** @type {HTMLSpanElement[]} */
			const punctuation = Array.prototype.slice.call(
				code.querySelectorAll('span.' + mapClassName('token') + '.' + mapClassName('punctuation'))
			);

			/** @type {{ index: number, open: boolean, element: HTMLElement }[]} */
			const allBraces = [];

			toMatch.forEach((open) => {
				const close = PARTNER[open];
				const name = mapClassName(NAMES[open]);

				/** @type {[number, number][]} */
				const pairs = [];
				/** @type {number[]} */
				const openStack = [];

				for (let i = 0; i < punctuation.length; i++) {
					const element = punctuation[i];
					if (element.childElementCount == 0) {
						let text = element.textContent;
						text = BRACE_ALIAS_MAP[text] || text;
						if (text === open) {
							allBraces.push({ index: i, open: true, element });
							element.classList.add(name);
							element.classList.add(mapClassName('brace-open'));
							openStack.push(i);
						} else if (text === close) {
							allBraces.push({ index: i, open: false, element });
							element.classList.add(name);
							element.classList.add(mapClassName('brace-close'));
							if (openStack.length) {
								pairs.push([i, openStack.pop()]);
							}
						}
					}
				}

				pairs.forEach((pair) => {
					const pairId = 'pair-' + (pairIdCounter++) + '-';

					const opening = punctuation[pair[0]];
					const closing = punctuation[pair[1]];

					opening.id = pairId + 'open';
					closing.id = pairId + 'close';

					[opening, closing].forEach((e) => {
						e.addEventListener('mouseenter', hoverBrace);
						e.addEventListener('mouseleave', leaveBrace);
						e.addEventListener('click', clickBrace);
					});
				});
			});

			let level = 0;
			allBraces.sort((a, b) => a.index - b.index);
			allBraces.forEach((brace) => {
				if (brace.open) {
					brace.element.classList.add(mapClassName('brace-level-' + (level % LEVEL_WARP + 1)));
					level++;
				} else {
					level = Math.max(0, level - 1);
					brace.element.classList.add(mapClassName('brace-level-' + (level % LEVEL_WARP + 1)));
				}
			});
		});
	}
});
