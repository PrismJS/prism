import prism from '../../global.js';
import { tokenizeStrings } from '../../shared/tokenize-strings.js';

/** @type {import('../../types.d.ts').PluginProto<'data-uri-highlight'>} */
const Self = {
	id: 'data-uri-highlight',
	optional: 'diff-highlight',
	effect (Prism) {
		const uri = {
			'data-uri': {
				pattern:
					/(['"])data:[^,\/]+\/[^,]+,(?:(?!\1)[\s\S]|\\\1)+(?=\1)|^data:[^,\/]+\/[^,]+,[\s\S]+$/,
				lookbehind: true,
				inside: {
					'language-css': {
						pattern: /(data:[^,\/]+\/(?:[^+,]+\+)?css,)[\s\S]+/,
						lookbehind: true,
						inside: 'css',
					},
					'language-javascript': {
						pattern: /(data:[^,\/]+\/(?:[^+,]+\+)?javascript,)[\s\S]+/,
						lookbehind: true,
						inside: 'javascript',
					},
					'language-json': {
						pattern: /(data:[^,\/]+\/(?:[^+,]+\+)?json,)[\s\S]+/,
						lookbehind: true,
						inside: 'json',
					},
					'language-markup': {
						pattern: /(data:[^,\/]+\/(?:[^+,]+\+)?(?:html|xml),)[\s\S]+/,
						lookbehind: true,
						inside: 'markup',
					},
				},
			},
		};

		return Prism.hooks.add('after-tokenize', env => {
			tokenizeStrings(env.tokens, code => Prism.tokenize(code, uri));
		});
	},
};

export default Self;

prism.components.add(Self);
