import prism from '../../global.js';
import { tokenizeStrings } from '../../shared/tokenize-strings.js';

/** @type {import('../../types.d.ts').PluginProto<'autolinker'>} */
const Self = {
	id: 'autolinker',
	optional: 'diff-highlight',
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

		const links = {
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

					env.tag = 'a';
					env.attributes.href = href;
				}
			},
		});
	},
};

export default Self;

prism.components.add(Self);
