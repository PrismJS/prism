import { embeddedIn } from '../shared/languages/templating.js';
import lua from './lua.js';
import markup from './markup.js';

/** @type {import('../types.d.ts').LanguageProto<'etlua'>} */
export default {
	id: 'etlua',
	require: [lua, markup],
	grammar: {
		'etlua': {
			pattern: /<%[\s\S]+?%>/,
			inside: {
				'delimiter': {
					pattern: /^<%[-=]?|-?%>$/,
					alias: 'punctuation',
				},
				'language-lua': {
					pattern: /[\s\S]+/,
					inside: 'lua',
				},
			},
		},
		$tokenize: embeddedIn('markup'),
	},
};
