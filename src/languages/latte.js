import { embeddedIn } from '../shared/languages/templating.js';
import { insertBefore } from '../util/language-util.js';
import markup from './markup.js';
import php from './php.js';

/** @type {import('../types.d.ts').LanguageProto<'latte'>} */
export default {
	id: 'latte',
	require: [markup, php],
	grammar ({ extend }) {
		const markupLatte = extend('markup', {});
		const tag = /** @type {GrammarToken & { inside: Grammar }} */ (markupLatte.tag);
		insertBefore(tag.inside, 'attr-value', {
			'n-attr': {
				pattern: /n:[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+))?/,
				inside: {
					'attr-name': {
						pattern: /^[^\s=]+/,
						alias: 'important',
					},
					'attr-value': {
						pattern: /=[\s\S]+/,
						inside: {
							'punctuation': [
								/^=/,
								{
									pattern: /^(\s*)["']|["']$/,
									lookbehind: true,
								},
							],
							'php': {
								pattern: /\S(?:[\s\S]*\S)?/,
								inside: 'php',
							},
						},
					},
				},
			},
		});

		return /** @type {Grammar} */ ({
			'latte-comment': {
				pattern: /\{\*[\s\S]*?\*\}/,
				greedy: true,
				alias: 'comment',
			},
			'latte': {
				pattern:
					/\{[^'"\s{}*](?:[^"'/{}]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|\/\*(?:[^*]|\*(?!\/))*\*\/)*\}/,
				greedy: true,
				inside: {
					'latte-tag': {
						// https://latte.nette.org/en/tags
						pattern: /(^\{(?:\/(?=[a-z]))?)(?:[=_]|[a-z]\w*\b(?!\())/i,
						lookbehind: true,
						alias: 'important',
					},
					'delimiter': {
						pattern: /^\{\/?|\}$/,
						alias: 'punctuation',
					},
					'php': {
						pattern: /\S(?:[\s\S]*\S)?/,
						alias: 'language-php',
						inside: 'php',
					},
				},
			},
			$tokenize: /** @type {Grammar['$tokenize']} */ (embeddedIn(markupLatte)),
		});
	},
};

/**
 * @typedef {import('../types.d.ts').Grammar} Grammar
 * @typedef {import('../types.d.ts').GrammarToken} GrammarToken
 */
