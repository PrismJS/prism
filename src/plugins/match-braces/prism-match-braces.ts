import { getParentPre, isActive } from '../../shared/dom-util';
import type { PluginProto } from '../../types';

export default {
	id: 'match-braces',
	effect(Prism) {
		function mapClassName(name: string) {
			const customClass = Prism.plugins.customClass;
			if (customClass) {
				return customClass.apply(name);
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
		const BRACE_ALIAS_MAP: Readonly<Record<string, string>> = {
			'${': '{', // JS template punctuation (e.g. `foo ${bar + 1}`)
		};

		const LEVEL_WARP = 12;

		let pairIdCounter = 0;

		const BRACE_ID_PATTERN = /^(pair-\d+-)(close|open)$/;

		/**
		 * Returns the brace partner given one brace of a brace pair.
		 */
		function getPartnerBrace(brace: Element) {
			const match = BRACE_ID_PATTERN.exec(brace.id);
			if (!match) {
				return null;
			}
			return document.querySelector('#' + match[1] + (match[2] === 'open' ? 'close' : 'open'));
		}

		function hoverBrace(this: Element) {
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
		function leaveBrace(this: Element) {
			const partner = getPartnerBrace(this);
			if (!partner) {
				return;
			}

			[this, partner].forEach((e) => {
				e.classList.remove(mapClassName('brace-hover'));
			});
		}
		function clickBrace(this: Element) {
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

		const withEventListener = new WeakSet<Element>();

		return Prism.hooks.add('complete', (env) => {
			const code = env.element;

			const pre = getParentPre(code);
			if (!pre) {
				return;
			}

			// find the braces to match
			const toMatch: (keyof typeof PARTNER)[] = [];
			if (isActive(code, 'match-braces')) {
				toMatch.push('(', '[', '{');
			}

			if (toMatch.length === 0) {
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

			const allBraces: { index: number, open: boolean, element: Element }[] = [];

			toMatch.forEach((open) => {
				const close = PARTNER[open];
				const name = mapClassName(NAMES[open]);

				const pairs: [number, number][] = [];
				const openStack: number[] = [];

				for (let i = 0; i < punctuation.length; i++) {
					const element = punctuation[i];
					if (element.childElementCount === 0) {
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
					const pairId = `pair-${pairIdCounter++}-`;

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
					brace.element.classList.add(mapClassName(`brace-level-${level % LEVEL_WARP + 1}`));
					level++;
				} else {
					level = Math.max(0, level - 1);
					brace.element.classList.add(mapClassName(`brace-level-${level % LEVEL_WARP + 1}`));
				}
			});
		});
	}
} as PluginProto<'match-braces'>;
