import { embeddedIn } from '../shared/languages/templating.js';
import markup from './markup.js';
import ruby from './ruby.js';

/** @type {import('../types.d.ts').LanguageProto<'erb'>} */
export default {
	id: 'erb',
	require: [ruby, markup],
	grammar: /** @type {Grammar} */ ({
		'erb': {
			pattern:
				/<%=?(?:[^\r\n]|[\r\n](?!=begin)|[\r\n]=begin\s(?:[^\r\n]|[\r\n](?!=end))*[\r\n]=end)+?%>/,
			inside: {
				'delimiter': {
					pattern: /^<%=?|%>$/,
					alias: 'punctuation',
				},
				'ruby': {
					pattern: /\s*\S[\s\S]*/,
					alias: 'language-ruby',
					inside: 'ruby',
				},
			},
		},
		$tokenize: /** @type {Grammar['$tokenize']} */ (embeddedIn('markup')),
	}),
};

/**
 * @typedef {import('../types.d.ts').Grammar} Grammar
 */
