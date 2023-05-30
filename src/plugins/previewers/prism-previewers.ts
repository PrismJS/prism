/* eslint-disable @typescript-eslint/no-non-null-assertion */
import cssExtras from '../../languages/prism-css-extras';
import { forEach } from '../../shared/util';
import type { PluginProto } from '../../types';

/**
 * Returns the absolute X, Y offsets for an element
 */
const getOffset = (element: Element): { top: number, right: number, bottom: number, left: number, width: number, height: number } => {
	const elementBounds = element.getBoundingClientRect();
	let left = elementBounds.left;
	let top = elementBounds.top;
	const documentBounds = document.documentElement.getBoundingClientRect();
	left -= documentBounds.left;
	top -= documentBounds.top;

	return {
		top,
		right: innerWidth - left - elementBounds.width,
		bottom: innerHeight - top - elementBounds.height,
		left,
		width: elementBounds.width,
		height: elementBounds.height
	};
};

const TOKEN_CLASS = 'token';
const ACTIVE_CLASS = 'active';
const FLIPPED_CLASS = 'flipped';

type Updater = (this: HTMLDivElement, value: string) => boolean;
type PreviewerE = Previewer & { ['_elt']: HTMLDivElement };
type Initializer = (this: PreviewerE) => void;
class Previewer {
	readonly type: string;
	supportedLanguages: string | string[];
	updater: Updater;
	initializer: Initializer | undefined;

	/** @package */
	_elt: HTMLDivElement | null = null;
	private _token: Element | null = null;

	/**
	 * Previewer constructor
	 *
	 * @param type Unique previewer type
	 * @param updater Function that will be called on mouseover.
	 * @param supportedLanguages Aliases of the languages this previewer must be enabled for. Defaults to "*", all languages.
	 * @param initializer Function that will be called on initialization.
	 */
	constructor(type: string, updater: Updater, supportedLanguages: string[] | string = '*', initializer?: Initializer) {
		this.type = type;
		this.supportedLanguages = supportedLanguages;
		this.updater = updater;
		this.initializer = initializer;
	}
	/**
	 * Creates the HTML element for the previewer.
	 */
	init(): asserts this is PreviewerE {
		if (this._elt) {
			return;
		}
		this._elt = document.createElement('div');
		this._elt.className = 'prism-previewer prism-previewer-' + this.type;
		document.body.appendChild(this._elt);
		if (this.initializer) {
			this.initializer.call(this as PreviewerE);
		}
	}
	isDisabled(token: Element): boolean {
		const previewers = token.closest('[data-previewers]')?.getAttribute('data-previewers');
		const parts = (previewers || '').split(/\s+/);
		return !parts.includes(this.type);
	}
	/**
	 * Checks the class name of each hovered element
	 */
	tryShow(token: Element): void {
		if (token.classList.contains(TOKEN_CLASS) && this.isDisabled(token)) {
			return;
		}
		const target = token.closest(`.${TOKEN_CLASS}.${this.type}`);
		if (target && target !== this._token) {
			this._token = target;
			this.show();
		}
	}
	/**
	 * Called on mouseout
	 *
	 * @private
	 */
	mouseout = () => {
		this._token?.removeEventListener('mouseout', this.mouseout, false);
		this._token = null;
		this.hide();
	};
	/**
	 * Shows the previewer positioned properly for the current token.
	 */
	show() {
		this.init();

		if (!this._token) {
			return;
		}

		if (this.updater.call(this._elt, this._token.textContent || '')) {
			this._token.addEventListener('mouseout', this.mouseout, false);

			const offset = getOffset(this._token);
			this._elt.classList.add(ACTIVE_CLASS);

			if (offset.top - this._elt.offsetHeight > 0) {
				this._elt.classList.remove(FLIPPED_CLASS);
				this._elt.style.top = `${offset.top}px`;
				this._elt.style.bottom = '';
			} else {
				this._elt.classList.add(FLIPPED_CLASS);
				this._elt.style.bottom = `${offset.bottom}px`;
				this._elt.style.top = '';
			}

			this._elt.style.left = `${(offset.left + Math.min(200, offset.width / 2))}px`;
		} else {
			this.hide();
		}
	}
	/**
	 * Hides the previewer.
	 */
	hide() {
		this._elt?.classList.remove(ACTIVE_CLASS);
	}
}


export class PreviewerCollection {
	/**
	 * Map of all registered previewers by language.
	 */
	readonly byLanguages = new Map<string, Previewer[]>();
	/**
	 * Map of all registered previewers by type
	 */
	readonly byType = new Map<string, Previewer>();

	add(previewer: Previewer) {
		forEach(previewer.supportedLanguages, (lang) => {
			let list = this.byLanguages.get(lang);
			if (list === undefined) {
				list = [];
				this.byLanguages.set(lang, list);
			}
			if (!list.includes(previewer)) {
				list.push(previewer);
			}
		});

		this.byType.set(previewer.type, previewer);
	}

	/**
	 * Initializes the mouseover event on the code block.
	 *
	 * @param elt The code block (`env.element`)
	 * @param lang The language (`env.language`)
	 */
	initEvents(elt: Element, lang: string) {
		const previewers: Previewer[] = [];
		previewers.push(...(this.byLanguages.get(lang) ?? []));
		previewers.push(...(this.byLanguages.get('*') ?? []));
		if (previewers.length === 0) {
			return;
		}
		elt.addEventListener('mouseover', (e) => {
			const target = e.target;
			if (target) {
				previewers.forEach((previewer) => {
					previewer.tryShow(target as Element);
				});
			}
		}, false);
	}
}

// TODO: Filthy hack to be able to load this script
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Prism = { languages: {} as Record<string, any> };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const previewers = {
	// gradient must be defined before color and angle
	'gradient': {
		create() {

			/**
			 * Stores already processed gradients so that we don't
			 * make the conversion every time the previewer is shown
			 */
			const cache: Record<string, string> = {};

			/**
			 * Returns a W3C-valid linear gradient
			 *
			 * @param prefix Vendor prefix if any ("-moz-", "-webkit-", etc.)
			 * @param func Gradient function name ("linear-gradient")
			 * @param values Array of the gradient function parameters (["0deg", "red 0%", "blue 100%"])
			 */
			function convertToW3CLinearGradient(prefix: string, func: string, values: string[]) {
				// Default value for angle
				let angle = '180deg';

				const first = values[0];
				if (first && /^(?:-?(?:\d+(?:\.\d+)?|\.\d+)(?:deg|rad)|bottom|left|right|to\b|top)/.test(first)) {
					angle = first;
					values.shift();
					if (!angle.includes('to ')) {
						// Angle uses old keywords
						// W3C syntax uses "to" + opposite keywords
						if (angle.includes('top')) {
							if (angle.includes('left')) {
								angle = 'to bottom right';
							} else if (angle.includes('right')) {
								angle = 'to bottom left';
							} else {
								angle = 'to bottom';
							}
						} else if (angle.includes('bottom')) {
							if (angle.includes('left')) {
								angle = 'to top right';
							} else if (angle.includes('right')) {
								angle = 'to top left';
							} else {
								angle = 'to top';
							}
						} else if (angle.includes('left')) {
							angle = 'to right';
						} else if (angle.includes('right')) {
							angle = 'to left';
						} else if (prefix) {
							// Angle is shifted by 90deg in prefixed gradients
							if (angle.includes('deg')) {
								angle = `${90 - parseFloat(angle)}deg`;
							} else if (angle.includes('rad')) {
								angle = `${Math.PI / 2 - parseFloat(angle)}rad`;
							}
						}
					}
				}

				return func + '(' + angle + ',' + values.join(',') + ')';
			}

			/**
			 * Returns a W3C-valid radial gradient
			 *
			 * @param prefix Vendor prefix if any ("-moz-", "-webkit-", etc.)
			 * @param func Gradient function name ("linear-gradient")
			 * @param values Array of the gradient function parameters (["0deg", "red 0%", "blue 100%"])
			 */
			function convertToW3CRadialGradient(prefix: string, func: string, values: string[]) {
				if (!values[0].includes('at')) {
					// Looks like old syntax

					// Default values
					let position = 'center';
					let shape = 'ellipse';
					let size = 'farthest-corner';

					if (/\b(?:bottom|center|left|right|top)\b|^\d+/.test(values[0])) {
						// Found a position
						// Remove angle value, if any
						position = values.shift()!.replace(/\s*-?\d+(?:deg|rad)\s*/, '');
					}
					if (/\b(?:circle|closest|contain|cover|ellipse|farthest)\b/.test(values[0])) {
						// Found a shape and/or size
						const shapeSizeParts = values.shift()!.split(/\s+/);
						if (shapeSizeParts[0] && (shapeSizeParts[0] === 'circle' || shapeSizeParts[0] === 'ellipse')) {
							shape = shapeSizeParts.shift()!;
						}
						if (shapeSizeParts[0]) {
							size = shapeSizeParts.shift()!;
						}

						// Old keywords are converted to their synonyms
						if (size === 'cover') {
							size = 'farthest-corner';
						} else if (size === 'contain') {
							size = 'clothest-side';
						}
					}

					return func + '(' + shape + ' ' + size + ' at ' + position + ',' + values.join(',') + ')';
				}
				return func + '(' + values.join(',') + ')';
			}

			/**
			 * Converts a gradient to a W3C-valid one
			 * Does not support old webkit syntax (-webkit-gradient(linear...) and -webkit-gradient(radial...))
			 *
			 * @param gradient The CSS gradient
			 */
			function convertToW3CGradient(gradient: string) {
				if (cache[gradient]) {
					return cache[gradient];
				}

				const values = gradient.replace(/^(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\(|\)$/g, '').split(/\s*,\s*/);
				const parts = gradient.match(/^(\b|\B-[a-z]{1,10}-)((?:repeating-)?(?:linear|radial)-gradient)/);

				if (!parts) {
					return cache[gradient] = '';
				}

				// "", "-moz-", etc.
				const prefix = parts[1];
				// "linear-gradient", "radial-gradient", etc.
				const func = parts[2];

				if (func.includes('linear')) {
					return cache[gradient] = convertToW3CLinearGradient(prefix, func, values);
				} else if (func.includes('radial')) {
					return cache[gradient] = convertToW3CRadialGradient(prefix, func, values);
				}
				return cache[gradient] = func + '(' + values.join(',') + ')';
			}

			return new Previewer('gradient', function (value) {
				const first = this.firstChild as HTMLElement | null;
				if (!first) {
					return false;
				}
				first.style.backgroundImage = '';
				first.style.backgroundImage = convertToW3CGradient(value);
				return !!first.style.backgroundImage;
			}, '*', function () {
				this._elt.innerHTML = '<div></div>';
			});
		},
		tokens: {
			'gradient': {
				pattern: /(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\((?:(?:hsl|rgb)a?\(.+?\)|[^\)])+\)/gi,
				inside: {
					'function': /[\w-]+(?=\()/,
					'punctuation': /[(),]/
				}
			}
		},
		languages: {
			'css': true,
			'less': true,
			'sass': [
				{
					lang: 'sass',
					before: 'punctuation',
					inside: 'inside',
					root: Prism.languages.sass && Prism.languages.sass['variable-line']
				},
				{
					lang: 'sass',
					before: 'punctuation',
					inside: 'inside',
					root: Prism.languages.sass && Prism.languages.sass['property-line']
				}
			],
			'scss': true,
			'stylus': [
				{
					lang: 'stylus',
					before: 'func',
					inside: 'rest',
					root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside
				},
				{
					lang: 'stylus',
					before: 'func',
					inside: 'rest',
					root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside
				}
			]
		}
	},
	'angle': {
		create() {
			return new Previewer('angle', function (value) {
				const num = parseFloat(value);
				const unit = value.match(/[a-z]+$/i);
				let max = 1;
				if (!num || !unit) {
					return false;
				}

				switch (unit[0]) {
					case 'deg':
						max = 360;
						break;
					case 'grad':
						max = 400;
						break;
					case 'rad':
						max = 2 * Math.PI;
						break;
					case 'turn':
						max = 1;
				}

				const percentage = (100 * num / max) % 100;
				this[`${num < 0 ? 'set' : 'remove'}Attribute`]('data-negative', '');
				const circle = this.querySelector('circle');
				if (circle) {
					circle.style.strokeDasharray = `${Math.abs(percentage)},500`;
				}
				return true;
			}, '*', function () {
				this._elt.innerHTML = '<svg viewBox="0 0 64 64">' +
					'<circle r="16" cy="32" cx="32"></circle>' +
					'</svg>';
			});
		},
		tokens: {
			'angle': /(?:\b|\B-|(?=\B\.))(?:\d+(?:\.\d+)?|\.\d+)(?:deg|g?rad|turn)\b/i
		},
		languages: {
			'css': true,
			'less': true,
			'markup': {
				lang: 'markup',
				before: 'punctuation',
				inside: 'inside',
				root: Prism.languages.markup && Prism.languages.markup['tag'].inside['attr-value']
			},
			'sass': [
				{
					lang: 'sass',
					inside: 'inside',
					root: Prism.languages.sass && Prism.languages.sass['property-line']
				},
				{
					lang: 'sass',
					before: 'operator',
					inside: 'inside',
					root: Prism.languages.sass && Prism.languages.sass['variable-line']
				}
			],
			'scss': true,
			'stylus': [
				{
					lang: 'stylus',
					before: 'func',
					inside: 'rest',
					root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside
				},
				{
					lang: 'stylus',
					before: 'func',
					inside: 'rest',
					root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside
				}
			]
		}
	},
	'color': {
		create() {
			return new Previewer('color', function (value) {
				this.style.backgroundColor = '';
				this.style.backgroundColor = value;
				return !!this.style.backgroundColor;
			});
		},
		tokens: {
			'color': [Prism.languages.css?.['hexcode']].concat(Prism.languages.css?.['color'])
		},
		languages: {
			// CSS extras is required, so css and scss are not necessary
			'css': false,
			'less': true,
			'markup': {
				lang: 'markup',
				before: 'punctuation',
				inside: 'inside',
				root: Prism.languages.markup && Prism.languages.markup['tag'].inside['attr-value']
			},
			'sass': [
				{
					lang: 'sass',
					before: 'punctuation',
					inside: 'inside',
					root: Prism.languages.sass && Prism.languages.sass['variable-line']
				},
				{
					lang: 'sass',
					inside: 'inside',
					root: Prism.languages.sass && Prism.languages.sass['property-line']
				}
			],
			'scss': false,
			'stylus': [
				{
					lang: 'stylus',
					before: 'hexcode',
					inside: 'rest',
					root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside
				},
				{
					lang: 'stylus',
					before: 'hexcode',
					inside: 'rest',
					root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside
				}
			]
		}
	},
	'easing': {
		create() {
			const identifierMap: Partial<Record<string, string>> = {
				'linear': '0,0,1,1',
				'ease': '.25,.1,.25,1',
				'ease-in': '.42,0,1,1',
				'ease-out': '0,0,.58,1',
				'ease-in-out': '.42,0,.58,1'
			};
			return new Previewer('easing', function (value) {
				value = identifierMap[value] || value;

				const p = value.match(/-?(?:\d+(?:\.\d+)?|\.\d+)/g);

				if (p && p.length === 4) {
					const values = p.map(Number).map((p, i) => (i % 2 ? 1 - p : p) * 100).map(String);

					this.querySelector('path')?.setAttribute('d', 'M0,100 C' + values[0] + ',' + values[1] + ', ' + values[2] + ',' + values[3] + ', 100,0');

					const lines = this.querySelectorAll('line');
					lines[0].setAttribute('x2', values[0]);
					lines[0].setAttribute('y2', values[1]);
					lines[1].setAttribute('x2', values[2]);
					lines[1].setAttribute('y2', values[3]);

					return true;
				}

				return false;
			}, '*', function () {
				this._elt.innerHTML = '<svg viewBox="-20 -20 140 140" width="100" height="100">' +
					'<defs>' +
					'<marker id="prism-previewer-easing-marker" viewBox="0 0 4 4" refX="2" refY="2" markerUnits="strokeWidth">' +
					'<circle cx="2" cy="2" r="1.5" />' +
					'</marker>' +
					'</defs>' +
					'<path d="M0,100 C20,50, 40,30, 100,0" />' +
					'<line x1="0" y1="100" x2="20" y2="50" marker-start="url(#prism-previewer-easing-marker)" marker-end="url(#prism-previewer-easing-marker)" />' +
					'<line x1="100" y1="0" x2="40" y2="30" marker-start="url(#prism-previewer-easing-marker)" marker-end="url(#prism-previewer-easing-marker)" />' +
					'</svg>';
			});
		},
		tokens: {
			'easing': {
				pattern: /\bcubic-bezier\((?:-?(?:\d+(?:\.\d+)?|\.\d+),\s*){3}-?(?:\d+(?:\.\d+)?|\.\d+)\)\B|\b(?:ease(?:-in)?(?:-out)?|linear)(?=\s|[;}]|$)/i,
				inside: {
					'function': /[\w-]+(?=\()/,
					'punctuation': /[(),]/
				}
			}
		},
		languages: {
			'css': true,
			'less': true,
			'sass': [
				{
					lang: 'sass',
					inside: 'inside',
					before: 'punctuation',
					root: Prism.languages.sass && Prism.languages.sass['variable-line']
				},
				{
					lang: 'sass',
					inside: 'inside',
					root: Prism.languages.sass && Prism.languages.sass['property-line']
				}
			],
			'scss': true,
			'stylus': [
				{
					lang: 'stylus',
					before: 'hexcode',
					inside: 'rest',
					root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside
				},
				{
					lang: 'stylus',
					before: 'hexcode',
					inside: 'rest',
					root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside
				}
			]
		}
	},

	'time': {
		create() {
			return new Previewer('time', function (value) {
				const num = parseFloat(value);
				const unit = value.match(/[a-z]+$/i);
				if (!num || !unit) {
					return false;
				}
				const u = unit[0];
				const circle = this.querySelector('circle');
				if (circle) {
					circle.style.animationDuration = `${2 * num}${u}`;
				}
				return true;
			}, '*', function () {
				this._elt.innerHTML = '<svg viewBox="0 0 64 64">' +
					'<circle r="16" cy="32" cx="32"></circle>' +
					'</svg>';
			});
		},
		tokens: {
			'time': /(?:\b|\B-|(?=\B\.))(?:\d+(?:\.\d+)?|\.\d+)m?s\b/i
		},
		languages: {
			'css': true,
			'less': true,
			'markup': {
				lang: 'markup',
				before: 'punctuation',
				inside: 'inside',
				root: Prism.languages.markup && Prism.languages.markup['tag'].inside['attr-value']
			},
			'sass': [
				{
					lang: 'sass',
					inside: 'inside',
					root: Prism.languages.sass && Prism.languages.sass['property-line']
				},
				{
					lang: 'sass',
					before: 'operator',
					inside: 'inside',
					root: Prism.languages.sass && Prism.languages.sass['variable-line']
				}
			],
			'scss': true,
			'stylus': [
				{
					lang: 'stylus',
					before: 'hexcode',
					inside: 'rest',
					root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside
				},
				{
					lang: 'stylus',
					before: 'hexcode',
					inside: 'rest',
					root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside
				}
			]
		}
	}
};
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */


export default {
	id: 'previewers',
	require: cssExtras,
	plugin() {
		const collection = new PreviewerCollection();

		if (typeof document !== 'undefined') {
			for (const previewer of Object.values(previewers)) {
				collection.add(previewer.create());
			}
		}

		return collection;
	},
	effect(Prism) {
		/*
		Prism.hooks.add('before-highlight', (env) => {
			for (const previewer of Object.values(previewers)) {
				const languages = previewer.languages;
				if (languages[env.language] && !languages[env.language].initialized) {
					let lang = languages[env.language];
					if (!Array.isArray(lang)) {
						lang = [lang];
					}
					lang.forEach((lang) => {
						let before; let inside; let root; let skip;
						if (lang === true) {
							before = 'important';
							inside = env.language;
							lang = env.language;
						} else {
							before = lang.before || 'important';
							inside = lang.inside || lang.lang;
							root = lang.root || Prism.languages;
							skip = lang.skip;
							lang = env.language;
						}

						if (!skip && Prism.languages[lang]) {
							Prism.languages.insertBefore(inside, before, previewer.tokens, root);
							env.grammar = Prism.languages[lang];

							languages[env.language] = { initialized: true };
						}
					});
				}
			}
		});
		*/

		return Prism.hooks.add('after-highlight', (env) => {
			Prism.plugins.previewers.initEvents(env.element, env.language);
		});
	}
} as PluginProto<'previewers'>;
