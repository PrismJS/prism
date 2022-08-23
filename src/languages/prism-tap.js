import yaml from './prism-yaml.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'tap',
	require: yaml,
	grammar({ getLanguage }) {
		// https://en.wikipedia.org/wiki/Test_Anything_Protocol

		Prism.languages.tap = {
			'fail': /not ok[^#{\n\r]*/,
			'pass': /ok[^#{\n\r]*/,
			'pragma': /pragma [+-][a-z]+/,
			'bailout': /bail out!.*/i,
			'version': /TAP version \d+/i,
			'plan': /\b\d+\.\.\d+(?: +#.*)?/,
			'subtest': {
				pattern: /# Subtest(?:: .*)?/,
				greedy: true
			},
			'punctuation': /[{}]/,
			'directive': /#.*/,
			'yamlish': {
				pattern: /(^[ \t]*)---[\s\S]*?[\r\n][ \t]*\.\.\.$/m,
				lookbehind: true,
				inside: 'yaml',
				alias: 'language-yaml'
			}
		};
	}
});
