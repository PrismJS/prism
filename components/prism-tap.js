Prism.languages.tap = {
	pass: /(^|\n)(    )*ok[^#\{\n]*/,
	fail: /(^|\n)(    )*not ok[^#\{\n]*/,
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
