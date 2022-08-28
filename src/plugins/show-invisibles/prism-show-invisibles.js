import { noop } from '../../shared/util.js';

export default /** @type {import("../../types").PluginProto<'show-invisibles'>} */ ({
	id: 'show-invisibles',
	optional: ['autolinker', 'data-uri-highlight'],
	plugin(Prism) {
		return {}; // TODO:
	},
	effect(Prism) {
		const invisibles = {
			'tab': /\t/,
			'crlf': /\r\n/,
			'lf': /\n/,
			'cr': /\r/,
			'space': / /
		};


		/**
		 * Handles the recursive calling of `addInvisibles` for one token.
		 *
		 * @param {object | Array} tokens The grammar or array which contains the token.
		 * @param {string|number} name The name or index of the token in `tokens`.
		 */
		function handleToken(tokens, name) {
			const value = tokens[name];

			const type = Prism.util.type(value);
			switch (type) {
				case 'RegExp': {
					const inside = {};
					tokens[name] = {
						pattern: value,
						inside
					};
					addInvisibles(inside);
					break;
				}
				case 'Array': {
					for (let i = 0, l = value.length; i < l; i++) {
						handleToken(value, i);
					}
					break;
				}
				default: { // 'Object'
					// eslint-disable-next-line no-redeclare
					const inside = value.inside || (value.inside = {});
					addInvisibles(inside);
					break;
				}
			}
		}

		/**
		 * Recursively adds patterns to match invisible characters to the given grammar (if not added already).
		 *
		 * @param {object} grammar
		 */
		function addInvisibles(grammar) {
			if (!grammar || grammar['tab']) {
				return;
			}

			// assign invisibles here to "mark" the grammar in case of self references
			for (const name in invisibles) {
				if (invisibles.hasOwnProperty(name)) {
					grammar[name] = invisibles[name];
				}
			}

			for (const name in grammar) {
				if (grammar.hasOwnProperty(name) && !invisibles[name]) {
					if (name === 'rest') {
						addInvisibles(grammar['rest']);
					} else {
						handleToken(grammar, name);
					}
				}
			}
		}

		Prism.hooks.add('before-highlight', (env) => {
			addInvisibles(env.grammar);
		});
	}
});
