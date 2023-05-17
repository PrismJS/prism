(function (Prism) {
	console.log("PRISM!");
	Prism.languages.astro = Prism.languages.extend('tsx', {});
	Prism.languages.insertBefore('astro', 'prolog', {
		'frontmatter-component-script': {
			pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
			lookbehind: true,
			greedy: true,
			inside: {
				'punctuation': /^---|---$/,
				'front-matter': {
					pattern: /\S+(?:\s+\S+)*/,
					alias: ['yaml', 'language-yaml'],
					inside: Prism.languages.typescript
				}
			}
		},
	}
	)

}(Prism));