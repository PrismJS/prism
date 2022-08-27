import { noop } from '../../shared/util.js';

export default /** @type {import("../../types").PluginProto} */ ({
	id: 'wpd',
	plugin(Prism) {
		return {}; // TODO:
	},
	effect(Prism) {
		if (Prism.languages.css) {
			// check whether the selector is an advanced pattern before extending it
			if (Prism.languages.css.selector.pattern) {
				Prism.languages.css.selector.inside['pseudo-class'] = /:[\w-]+/;
				Prism.languages.css.selector.inside['pseudo-element'] = /::[\w-]+/;
			} else {
				Prism.languages.css.selector = {
					pattern: Prism.languages.css.selector,
					inside: {
						'pseudo-class': /:[\w-]+/,
						'pseudo-element': /::[\w-]+/
					}
				};
			}
		}

		/** @type {Set<string>} */
		const htmlTags = new Set([
			'a', 'abbr', 'acronym', 'b', 'basefont', 'bdo', 'big', 'blink', 'cite', 'code', 'dfn', 'em', 'kbd', 'i',
			'rp', 'rt', 'ruby', 's', 'samp', 'small', 'spacer', 'strike', 'strong', 'sub', 'sup', 'time', 'tt', 'u',
			'var', 'wbr', 'noframes', 'summary', 'command', 'dt', 'dd', 'figure', 'figcaption', 'center', 'section', 'nav',
			'article', 'aside', 'hgroup', 'header', 'footer', 'address', 'noscript', 'isIndex', 'main', 'mark', 'marquee',
			'meter', 'menu'
		]);
			/** @type {Set<string>} */
		const svgTags = new Set([
			'animateColor', 'animateMotion', 'animateTransform', 'glyph', 'feBlend', 'feColorMatrix', 'feComponentTransfer',
			'feFuncR', 'feFuncG', 'feFuncB', 'feFuncA', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
			'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'feSpecularLighting',
			'feTile', 'feTurbulence', 'feDistantLight', 'fePointLight', 'feSpotLight', 'linearGradient', 'radialGradient', 'altGlyph',
			'textPath', 'tref', 'altglyph', 'textpath', 'altglyphdef', 'altglyphitem', 'clipPath', 'color-profile', 'cursor',
			'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'glyphRef',
			'hkern', 'vkern'
		]);
			/** @type {Set<string>} */
		const mathmlTags = new Set();


		if (Prism.languages.markup) {
			Prism.languages.markup.tag.inside.tag.inside['tag-id'] = /[\w-]+/;
		}

		let language;

		Prism.hooks.add('wrap', (env) => {
			if ((env.type == 'tag-id'
					|| (env.type == 'property' && env.content.indexOf('-') != 0)
					|| (env.type == 'rule' && env.content.indexOf('@-') != 0)
					|| (env.type == 'pseudo-class' && env.content.indexOf(':-') != 0)
					|| (env.type == 'pseudo-element' && env.content.indexOf('::-') != 0)
					|| (env.type == 'attr-name' && env.content.indexOf('data-') != 0)
			) && env.content.indexOf('<') === -1
			) {
				if (env.language == 'css'
						|| env.language == 'scss'
						|| env.language == 'markup'
				) {
					let href = 'https://webplatform.github.io/docs/';
					let content = env.content;

					if (env.language == 'css' || env.language == 'scss') {
						href += 'css/';

						if (env.type == 'property') {
							href += 'properties/';
						} else if (env.type == 'rule') {
							href += 'atrules/';
							content = content.substring(1);
						} else if (env.type == 'pseudo-class') {
							href += 'selectors/pseudo-classes/';
							content = content.substring(1);
						} else if (env.type == 'pseudo-element') {
							href += 'selectors/pseudo-elements/';
							content = content.substring(2);
						}
					} else if (env.language == 'markup') {
						if (env.type == 'tag-id') {
							// Check language
							language = getLanguage(env.content) || language;

							if (language) {
								href += language + '/elements/';
							} else {
								return; // Abort
							}
						} else if (env.type == 'attr-name') {
							if (language) {
								href += language + '/attributes/';
							} else {
								return; // Abort
							}
						}
					}

					href += content;
					env.tag = 'a';
					env.attributes.href = href;
					env.attributes.target = '_blank';
				}
			}
		});

		/**
		 * @param {string} tag
		 */
		function getLanguage(tag) {
			const tagL = tag.toLowerCase();

			if (htmlTags.has(tagL)) {
				return 'html';
			} else if (svgTags.has(tag)) {
				return 'svg';
			} else if (mathmlTags.has(tag)) {
				return 'mathml';
			}

			// Not in dictionary, perform check

			if (typeof document !== 'undefined') {
				const htmlInterface = (document.createElement(tag).toString().match(/\[object HTML(.+)Element\]/) || [])[1];

				if (htmlInterface && htmlInterface != 'Unknown') {
					htmlTags.add(tagL);
					return 'html';
				}
			}

			if (typeof document !== 'undefined') {
				const svgInterface = (document.createElementNS('http://www.w3.org/2000/svg', tag).toString().match(/\[object SVG(.+)Element\]/) || [])[1];

				if (svgInterface && svgInterface != 'Unknown') {
					svgTags.add(tag);
					return 'svg';
				}
			}

			// Lame way to detect MathML, but browsers don’t expose interface names there :(
			if (tag.startsWith('m')) {
				mathmlTags.add(tag);
				return 'mathml';
			}

			return null;
		}
	}
});
