import { tokenizeStrings } from '../../shared/tokenize-strings';
import type { PluginProto } from '../../types';

export default {
	id: 'show-invisibles',
	optional: ['autolinker', 'data-uri-highlight', 'diff-highlight'],
	effect(Prism) {
		const invisibles = {
			'tab': /\t/,
			'crlf': /\r\n/,
			'lf': /\n/,
			'cr': /\r/,
			'space': / /
		};

		return Prism.hooks.add('after-tokenize', (env) => {
			tokenizeStrings(env.tokens, (code) => Prism.tokenize(code, invisibles));
		});
	}
} as PluginProto<'show-invisibles'>;
