import { embeddedIn } from '../shared/languages/templating';
import markup from './markup';
import php from './php';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'latte',
	base: markup,
	require: php,
	grammar () {
		return {
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
			$insertBefore: {
				'tag/attr-value': {
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
				},
			},
			$tokenize: embeddedIn('markup'),
		} as unknown as Grammar;
	},
} as LanguageProto<'latte'>;
