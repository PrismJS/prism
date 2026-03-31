import prism from '../../global.js';
import { tokenizeStrings } from '../../shared/tokenize-strings.js';

/** @type {import('../../types.d.ts').PluginProto<'show-invisibles'>} */
const Self = {
	id: 'show-invisibles',
	optional: ['autolinker', 'data-uri-highlight', 'diff-highlight'],
	effect (Prism) {
		const invisibles = {
			'tab': /\t/,
			'crlf': /\r\n/,
			'lf': /\n/,
			'cr': /\r/,
			'space': / /,
		};

		return Prism.hooks.add('after-tokenize', env => {
			tokenizeStrings(env.tokens, code => Prism.tokenize(code, invisibles));
		});
	},
};

export default Self;

prism.pluginRegistry.add(Self);
