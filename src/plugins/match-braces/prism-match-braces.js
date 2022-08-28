import { getParentPre, isActive } from '../../shared/dom-util.js';

export default /** @type {import("../../types").PluginProto<'match-braces'>} */ ({
	id: 'match-braces',
	effect(Prism) {
		/**
		 * @param {string} name
		 * @returns {string}
		 */
		function mapClassName(name) {
			const customClass = /** @type {import('../custom-class/prism-custom-class.js').CustomClass} */ (Prism.plugins.customClass);
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
		/** @type {Readonly<Record<string, string>>} */
		const BRACE_ALIAS_MAP = {
			'${': '{', // JS template punctuation (e.g. `foo ${bar + 1}`)
		};

		const LEVEL_WARP = 12;

		let pairIdCounter = 0;

		const BRACE_ID_PATTERN = /^(pair-\d+-)(close|open)$/;

		/**
		 * Returns the brace partner given one brace of a brace pair.
		 *
		 * @param {Element} brace
		 * @returns {Element | null}
		 */
		function getPartnerBrace(brace) {
			const match = BRACE_ID_PATTERN.exec(brace.id);
			if (!match) {
				return null;
			}
			return document.querySelector('#' + match[1] + (match[2] == 'open' ? 'close' : 'open'));
		}

		/**
		 * @this {Element}
		 */
		function hoverBrace() {
			if (!isActive(this, 'brace-hover', true)) {
				return;
			}

			const partner = getPartnerBrace(this);
			if (!partner) {
				return;
			}

			[this, partner].forEach((e) => {
				e.classList.add(mapClassName('brace-hover'));
			});
		}
		/**
		 * @this {Element}
		 */
		function leaveBrace() {
			const partner = getPartnerBrace(this);
			if (!partner) {
				return;
			}

			[this, partner].forEach((e) => {
				e.classList.remove(mapClassName('brace-hover'));
			});
		}
		/**
		 * @this {Element}
		 */
		function clickBrace() {
			if (!isActive(this, 'brace-select', true)) {
				return;
			}

			const partner = getPartnerBrace(this);
			if (!partner) {
				return;
			}

			[this, partner].forEach((e) => {
				e.classList.add(mapClassName('brace-selected'));
			});
		}

		/** @type {WeakSet<Element>} */
		const withEventListener = new WeakSet();

		return Prism.hooks.add('complete', (env) => {
			const code = env.element;

			const pre = getParentPre(code);
			if (!pre) {
				return;
			}

			// find the braces to match
			/** @type {(keyof PARTNER)[]} */
			const toMatch = [];
			if (isActive(code, 'match-braces')) {
				toMatch.push('(', '[', '{');
			}

			if (toMatch.length == 0) {
				// nothing to match
				return;
			}

			if (!withEventListener.has(pre)) {
				// code blocks might be highlighted more than once
				withEventListener.add(pre);
				pre.addEventListener('mousedown', () => {
					// the code element might have been replaced
					const code = pre.querySelector('code');
					const className = mapClassName('brace-selected');
					code?.querySelectorAll('.' + className).forEach((e) => {
						e.classList.remove(className);
					});
				});
			}

			const punctuation = [...code.querySelectorAll('span.' + mapClassName('token') + '.' + mapClassName('punctuation'))];

			/** @type {{ index: number, open: boolean, element: Element }[]} */
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
						let text = element.textContent || '';
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
							const popped = openStack.pop();
							if (popped !== undefined) {
								pairs.push([i, popped]);
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
