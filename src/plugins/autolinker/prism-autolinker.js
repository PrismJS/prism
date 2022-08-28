import { noop } from '../../shared/util.js';

export default /** @type {import("../../types").PluginProto<'autolinker'>} */ ({
	id: 'autolinker',
	plugin(Prism) {
		return {}; // TODO:
	},
	effect(Prism) {
		const url = /\b([a-z]{3,7}:\/\/|tel:)[\w\-+%~/.:=&!$'()*,;@]+(?:\?[\w\-+%~/.:=?&!$'()*,;@]*)?(?:#[\w\-+%~/.:#=?&!$'()*,;@]*)?/;
		const email = /\b\S+@[\w.]+[a-z]{2}/;
		const linkMd = /\[([^\]]+)\]\(([^)]+)\)/;

		// Tokens that may contain URLs and emails
		const candidates = ['comment', 'url', 'attr-value', 'string'];

		Prism.plugins.autolinker = {
			processGrammar(grammar) {
				// Abort if grammar has already been processed
				if (!grammar || grammar['url-link']) {
					return;
				}
				Prism.languages.DFS(grammar, function (key, def, type) {
					if (candidates.indexOf(type) > -1 && !Array.isArray(def)) {
						if (!def.pattern) {
							def = this[key] = {
								pattern: def
							};
						}

						def.inside = def.inside || {};

						if (type == 'comment') {
							def.inside['md-link'] = linkMd;
						}
						if (type == 'attr-value') {
							Prism.languages.insertBefore('inside', 'punctuation', { 'url-link': url }, def);
						} else {
							def.inside['url-link'] = url;
						}

						def.inside['email-link'] = email;
					}
				});
				grammar['url-link'] = url;
				grammar['email-link'] = email;
			}
		};

		Prism.hooks.add('before-highlight', (env) => {
			Prism.plugins.autolinker.processGrammar(env.grammar);
		});

		Prism.hooks.add('wrap', (env) => {
			if (/-link$/.test(env.type)) {
				env.tag = 'a';

				let href = env.content;

				if (env.type == 'email-link' && href.indexOf('mailto:') != 0) {
					href = 'mailto:' + href;
				} else if (env.type == 'md-link') {
					// Markdown
					const match = env.content.match(linkMd);

					href = match[2];
					env.content = match[1];
				}

				env.attributes.href = href;

				// Silently catch any error thrown by decodeURIComponent (#1186)
				try {
					env.content = decodeURIComponent(env.content);
				} catch (e) { /* noop */ }
			}
		});
	}
});
