import { tokenizeStrings } from '../../shared/tokenize-strings';
import type { PluginProto } from '../../types';

export default {
	id: 'data-uri-highlight',
	optional: 'diff-highlight',
	effect(Prism) {
		const uri = {
			'data-uri': {
				pattern: /(['"])data:[^,\/]+\/[^,]+,(?:(?!\1)[\s\S]|\\\1)+(?=\1)|^data:[^,\/]+\/[^,]+,[\s\S]+$/,
				lookbehind: true,
				inside: {
					'language-css': {
						pattern: /(data:[^,\/]+\/(?:[^+,]+\+)?css,)[\s\S]+/,
						lookbehind: true,
						inside: 'css'
					},
					'language-javascript': {
						pattern: /(data:[^,\/]+\/(?:[^+,]+\+)?javascript,)[\s\S]+/,
						lookbehind: true,
						inside: 'javascript'
					},
					'language-json': {
						pattern: /(data:[^,\/]+\/(?:[^+,]+\+)?json,)[\s\S]+/,
						lookbehind: true,
						inside: 'json'
					},
					'language-markup': {
						pattern: /(data:[^,\/]+\/(?:[^+,]+\+)?(?:html|xml),)[\s\S]+/,
						lookbehind: true,
						inside: 'markup'
					}
				}
			}
		};

		return Prism.hooks.add('after-tokenize', (env) => {
			tokenizeStrings(env.tokens, (code) => Prism.tokenize(code, uri));
		});
	}
} as PluginProto<'data-uri-highlight'>;
