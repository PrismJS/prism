import registry from '../registry.js';
import markup from './markup.js';
import ruby from './ruby.js';

/** @type {import('../types.d.ts').LanguageProto<'erb'>} */
const Self = {
	id: 'erb',
	require: ruby,
	inner: markup,
	grammar: {
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
	},
};

export default Self;

registry.add(Self);
