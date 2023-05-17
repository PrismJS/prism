(function (Prism) {
	Prism.languages.astro = Prism.languages.extend('tsx', {
		comment: Prism.languages.tsx.comment.concat([
			{
				pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
				greedy: true,
			},
		]),
	});
	Prism.languages.insertBefore('astro', 'prolog', {
		'component-script-block': {
			pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
			lookbehind: true,
			greedy: true,
			inside: {
				punctuation: /^---|---$/,
				'component-script': {
					pattern: /\S+(?:\s+\S+)*/,
					inside: Prism.languages.typescript,
				},
			},
		},
	});
}(Prism));
