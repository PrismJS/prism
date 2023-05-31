import { getTextContent } from '../core/token';
import { withoutTokenize } from '../shared/language-util';
import { tokenize } from '../shared/symbols';
import type { LanguageProto } from '../types';

export default {
	id: 'treeview',
	alias: 'tree-view',
	grammar: {
		'treeview-part': {
			pattern: /^.+/m,
			inside: {
				'entry-line': [
					{
						pattern: /\|-- |├── /,
						alias: 'line-h'
					},
					{
						pattern: /\| {3}|│ {3}/,
						alias: 'line-v'
					},
					{
						pattern: /`-- |└── /,
						alias: 'line-v-last'
					},
					{
						pattern: / {4}/,
						alias: 'line-v-gap'
					}
				],
				'entry-name': {
					pattern: /\S(?:.*\S)?/,
					inside: {
						'directory-marker': {
							pattern: /(^|[^\\])\/$/,
							lookbehind: true
						},
						'file-marker': {
							pattern: /(^|[^\\])[=*|]$/,
							lookbehind: true
						},
						'symlink': {
							pattern: / -> /,
							alias: 'operator'
						}
					}
				},
				[tokenize](code, grammar, Prism) {
					const tokens = Prism.tokenize(code, withoutTokenize(grammar));

					for (const token of tokens) {
						if (typeof token === 'string' || token.type !== 'entry-name' || typeof token.content === 'string') {
							continue;
						}

						if (token.content.some((t) => typeof t !== 'string' && t.type === 'symlink')) {
							continue;
						}

						const text = getTextContent(token);

						const folderPattern = /(?:^|[^\\])\/$/;
						if (folderPattern.test(text)) {
							// folder
							token.addAlias('dir');
						} else {
							// file

							const parts = text
								.replace(/(^|[^\\])[=*|]$/, '$1')
								.toLowerCase()
								.replace(/\s+/g, '')
								.split('.');

							while (parts.length > 1) {
								parts.shift();
								// Ex. 'foo.min.js' would become '<span class="token keyword ext-min-js ext-js">foo.min.js</span>'
								token.addAlias('ext-' + parts.join('-'));
							}
						}

						if (text.startsWith('.')) {
							token.addAlias('dotfile');
						}
					}

					return tokens;
				}
			}
		}
	}
} as LanguageProto<'treeview'>;
