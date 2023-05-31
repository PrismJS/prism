import cssSelector from '../../languages/prism-css-selector';
import type { PluginProto } from '../../types';

const htmlTags = new Set<string>([
	'a', 'abbr', 'acronym', 'b', 'basefont', 'bdo', 'big', 'blink', 'cite', 'code', 'dfn', 'em', 'kbd', 'i',
	'rp', 'rt', 'ruby', 's', 'samp', 'small', 'spacer', 'strike', 'strong', 'sub', 'sup', 'time', 'tt', 'u',
	'var', 'wbr', 'noframes', 'summary', 'command', 'dt', 'dd', 'figure', 'figcaption', 'center', 'section', 'nav',
	'article', 'aside', 'hgroup', 'header', 'footer', 'address', 'noscript', 'isIndex', 'main', 'mark', 'marquee',
	'meter', 'menu'
]);
const svgTags = new Set<string>([
	'animateColor', 'animateMotion', 'animateTransform', 'glyph', 'feBlend', 'feColorMatrix', 'feComponentTransfer',
	'feFuncR', 'feFuncG', 'feFuncB', 'feFuncA', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
	'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'feSpecularLighting',
	'feTile', 'feTurbulence', 'feDistantLight', 'fePointLight', 'feSpotLight', 'linearGradient', 'radialGradient', 'altGlyph',
	'textPath', 'tref', 'altglyph', 'textpath', 'altglyphdef', 'altglyphitem', 'clipPath', 'color-profile', 'cursor',
	'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'glyphRef',
	'hkern', 'vkern'
]);
const mathmlTags = new Set<string>();


function getLanguage(tag: string) {
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
		if (htmlInterface && htmlInterface !== 'Unknown') {
			htmlTags.add(tagL);
			return 'html';
		}

		const svgInterface = (document.createElementNS('http://www.w3.org/2000/svg', tag).toString().match(/\[object SVG(.+)Element\]/) || [])[1];
		if (svgInterface && svgInterface !== 'Unknown') {
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

export default {
	id: 'wpd',
	require: cssSelector,
	effect(Prism) {
		return Prism.hooks.add('wrap', (env) => {
			let href = 'https://webplatform.github.io/docs/';
			let content = env.content;

			if (/[<&]/.test(content)) {
				return;
			}

			const lang = Prism.components.resolveAlias(env.language);
			if (lang === 'css' || lang === 'scss') {
				href += 'css/';

				if (env.type === 'property' && !content.startsWith('-')) {
					href += 'properties/';
				} else if (env.type === 'rule' && !content.startsWith('@-')) {
					href += 'atrules/';
					content = content.substring(1);
				} else if (env.type === 'pseudo-class' && !content.startsWith(':-')) {
					href += 'selectors/pseudo-classes/';
					content = content.substring(1);
				} else if (env.type === 'pseudo-element' && !content.startsWith('::-')) {
					href += 'selectors/pseudo-elements/';
					content = content.substring(2);
				} else {
					return;
				}
			} else if (lang === 'markup') {
				if (env.type === 'tag' && /^[\w-]+$/.test(content)) {
					// Check language
					const language = getLanguage(content);

					if (language) {
						href += language + '/elements/';
					} else {
						return; // Abort
					}
				} else {
					return;
				}
			} else {
				return;
			}

			href += content;
			env.tag = 'a';
			env.attributes.href = href;
			env.attributes.target = '_blank';
		});
	}
} as PluginProto<'wpd'>;
