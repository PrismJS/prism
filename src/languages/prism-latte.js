import { addHooks } from '../shared/hooks-util';
import { extend, insertBefore } from '../shared/language-util';
import { lazy } from '../shared/util';
import clike from './prism-clike';
import markup from './prism-markup';
import markupTemplating, { MarkupTemplating } from './prism-markup-templating';
import php from './prism-php';

export default /** @type {import("../types").LanguageProto<'latte'>} */ ({
	id: 'latte',
	require: [clike, markup, markupTemplating, php],
	grammar: {
		'comment': /^\{\*[\s\S]*/,
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
	},
	effect(Prism) {
		const getMarkupLatte = lazy(() => {
			const markup = /** @type {import('../types').Grammar} */(Prism.components.getLanguage('markup'));
			const markupLatte = extend(markup, 'markup', {});
			const tag = /** @type {import('../types').GrammarToken & { inside: import('../types').Grammar }} */ (markupLatte.tag);
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
			return markupLatte;
		});

		const templating = new MarkupTemplating(this.id, Prism);
		const lattePattern = /\{\*[\s\S]*?\*\}|\{[^'"\s{}*](?:[^"'/{}]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|\/\*(?:[^*]|\*(?!\/))*\*\/)*\}/g;

		return addHooks(Prism.hooks, {
			'before-tokenize': env => {
				templating.buildPlaceholders(env, lattePattern);
				env.grammar = getMarkupLatte();
			},
			'after-tokenize': env => {
				templating.tokenizePlaceholders(env);
			}
		});
	}
});
