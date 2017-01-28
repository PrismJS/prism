Prism.languages.tap = {
	pass: {
		pattern: /(^|\n)(    )*ok[^#\{\n]+/,
		greedy: true
	},
	fail: {
		pattern: /(^|\n)(    )*not ok[^#\{\n]+/,
		greedy: true
	},
	pragma: /(^|\n)(    )*pragma ([+-])([a-z]+)(\n|$)/,
	bailout: /(^|\n)(    )*bail out!(.*)(\n|$)/i,
	version: /(^|\n)(    )*TAP version ([0-9]+)(\n|$)/i,
	plan: /(^|\n)(    )*([0-9]+)\.\.([0-9]+)( +#[^\n]*)?(\n|$)/m,
	subtest: {
		pattern: /(^|\n)(    )*# Subtest(?:: (.*))?(\n|$)/,
		greedy: true
	},
	punctuation: /[{}]/,
	'comment': /#.*/,
	yamlish: {
		pattern: /(^|\n)((    )*(  ))---\n(.*?\n)+\2\.\.\.(\n|$)/,
		lookbehind: true,
		inside: Prism.languages.yaml,
		alias: 'language-yaml'
	}
};
