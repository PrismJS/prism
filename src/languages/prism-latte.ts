import { insertBefore } from '../shared/language-util';
import { embeddedIn } from '../shared/languages/templating';
import { tokenize } from '../shared/symbols';
import markup from './prism-markup';
import php from './prism-php';
import type { Grammar, GrammarToken, LanguageProto } from '../types';

export default {
	id: 'latte',
	require: [markup, php],
	grammar({ extend }) {
		const markupLatte = extend('markup', {});
		const tag = markupLatte.tag as GrammarToken & { inside: Grammar };
		insertBefore(tag.inside, 'attr-value', {
			'n-attr': {
				pattern: /n:[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+))?/,
				inside: {
					'attr-name': {
						pattern: /^[^\s=]+/,
						alias: 'important'
					},
					'attr-value': {
						pattern: /=[\s\S]+/,
						inside: {
							'punctuation': [
								/^=/,
								{
									pattern: /^(\s*)["']|["']$/,
									lookbehind: true
								}
							],
							'php': {
								pattern: /\S(?:[\s\S]*\S)?/,
								inside: 'php'
							}
						}
					},
				}
			},
		});

		return {
			'latte-comment': {
				pattern: /\{\*[\s\S]*?\*\}/,
				greedy: true,
				alias: 'comment'
			},
			'latte': {
				pattern: /\{[^'"\s{}*](?:[^"'/{}]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|\/\*(?:[^*]|\*(?!\/))*\*\/)*\}/,
				greedy: true,
				inside: {
					'latte-tag': {
						// https://latte.nette.org/en/tags
						pattern: /(^\{(?:\/(?=[a-z]))?)(?:[=_]|[a-z]\w*\b(?!\())/i,
						lookbehind: true,
						alias: 'important'
					},
					'delimiter': {
						pattern: /^\{\/?|\}$/,
						alias: 'punctuation'
					},
					'php': {
						pattern: /\S(?:[\s\S]*\S)?/,
						alias: 'language-php',
						inside: 'php'
					}
				}
			},
			[tokenize]: embeddedIn(markupLatte)
		};
	}
} as LanguageProto<'latte'>;
