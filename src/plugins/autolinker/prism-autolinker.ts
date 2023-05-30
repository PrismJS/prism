import { addHooks } from '../../shared/hooks-util';
import { tokenizeStrings } from '../../shared/tokenize-strings';
import type { PluginProto } from '../../types';

export default {
	id: 'autolinker',
	optional: 'diff-highlight',
	effect(Prism) {
		function balanced(chars: string) {
			return String.raw`(?:${chars}|\((?:${chars})*\))`;
		}

		const url = RegExp(
			/\b(?:[a-z]{3,7}:\/\/|tel:)/.source
			+ `${balanced(/[\w\-+%~/.:=&!$'*,;@]/.source)}+`
			+ `(?:\\?${balanced(/[\w\-+%~/.:=&!$'*,;@?]/.source)}*)?`
			+ `(?:#${balanced(/[\w\-+%~/.:=&!$'*,;@?#]/.source)}*)?`
		);
		const email = /\b\S+@[\w.]+[a-z]{2}/;

		const links = {
			'url-link': url,
			'email-link': email
		};

		return addHooks(Prism.hooks, {
			'after-tokenize': (env) => {
				tokenizeStrings(env.tokens, (code) => Prism.tokenize(code, links));
			},
			'wrap': (env) => {
				if (env.type.endsWith('-link')) {
					let href = env.content;

					if (env.type === 'email-link' && !href.startsWith('mailto:')) {
						href = 'mailto:' + href;
					}

					env.tag = 'a';
					env.attributes.href = href;
				}
			}
		});
	}
} as PluginProto<'autolinker'>;
