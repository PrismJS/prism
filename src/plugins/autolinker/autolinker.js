import prism from '../../global.js';
import { tokenizeStrings } from '../../shared/tokenize-strings.js';

/** @type {import('../../types.d.ts').PluginProto<'autolinker'>} */
const Self = {
	id: 'autolinker',
	effect (Prism) {
		/**
		 * @param {string} chars
		 * @returns {string}
		 */
		function balanced (chars) {
			return String.raw`(?:${chars}|\((?:${chars})*\))`;
		}

		const url = RegExp(
			/\b(?:[a-z]{3,7}:\/\/|tel:)/.source +
				`${balanced(/[\w\-+%~/.:=&!$'*,;@]/.source)}+` +
				`(?:\\?${balanced(/[\w\-+%~/.:=&!$'*,;@?]/.source)}*)?` +
				`(?:#${balanced(/[\w\-+%~/.:=&!$'*,;@?#]/.source)}*)?`
		);
		const email = /\b\S+@[\w.]+[a-z]{2}/;
		// Only a URL target: `handlers[name](event)` is code
		const mdLink = RegExp(String.raw`\[([^\]]+)\]\((${url.source})\)`);

		const links = {
			'md-link': mdLink,
			'url-link': url,
			'email-link': email,
		};

		return Prism.hooks.add({
			'after-tokenize': env => {
				tokenizeStrings(env.tokens, code => Prism.tokenize(code, links));
			},
			'wrap': env => {
				if (env.type.endsWith('-link')) {
					let href = env.content;

					if (env.type === 'email-link' && !href.startsWith('mailto:')) {
						href = 'mailto:' + href;
					}
					else if (env.type === 'md-link') {
						const [, text, link] = /** @type {RegExpMatchArray} */ (href.match(mdLink));
						env.content = text;
						href = link;
					}

					env.tag = 'a';
					env.attributes.href = href;
				}
			},
		});
	},
};

export default Self;

prism.pluginRegistry.add(Self);
