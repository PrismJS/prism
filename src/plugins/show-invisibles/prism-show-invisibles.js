export default /** @type {import("../../types").PluginProto<'show-invisibles'>} */ ({
	id: 'show-invisibles',
	optional: ['autolinker', 'data-uri-highlight'],
	effect(Prism) {
		const invisibles = {
			'tab': /\t/,
			'crlf': /\r\n/,
			'lf': /\n/,
			'cr': /\r/,
			'space': / /
		};

		/**
		 * @param {string} code
		 */
		const tokenize = code => {
			const tokens = Prism.tokenize(code, invisibles);
			if (tokens.length === 1) {
				const single = tokens[0];
				if (typeof single === 'string') {
					return single;
				}
			}
			return tokens;
		};

		/**
		 * @param {import("../../core/token").TokenStream} tokens
		 */
		const walkTokens = (tokens) => {
			for (let i = 0; i < tokens.length; i++) {
				const token = tokens[i];

				if (typeof token === 'string') {
					const result = tokenize(token);
					if (typeof result !== 'string') {
						tokens.splice(i, 1, ...result);
						i += result.length - 1;
					}
				} else if (typeof token.content === 'string') {
					token.content = tokenize(token.content);
				} else {
					walkTokens(token.content);
				}
			}
		};

		return Prism.hooks.add('after-tokenize', (env) => {
			walkTokens(env.tokens);
		});
	}
});
