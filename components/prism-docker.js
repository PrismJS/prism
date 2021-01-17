(function (Prism) {

	var string = /"(?:[^"\\\r\n]|\\(?:\r\n|[\s\S]))*"|'(?:[^'\\\r\n]|\\(?:\r\n|[\s\S]))*'/;
	var commentRule = {
		pattern: /(^[ \t]*)#.*/m,
		lookbehind: true,
		greedy: true
	};

	Prism.languages.docker = {
		'command': {
			pattern: /(^[ \t]*)(?:ADD|ARG|CMD|COPY|ENTRYPOINT|ENV|EXPOSE|FROM|HEALTHCHECK|LABEL|MAINTAINER|ONBUILD|RUN|SHELL|STOPSIGNAL|USER|VOLUME|WORKDIR)(?=\s)(?:\\.|[^\r\n\\])*(?:\\$(?:\s|#.*$)*(?![\s#])(?:\\.|[^\r\n\\])*)*/mi,
			lookbehind: true,
			greedy: true,
			inside: {
				'instruction': {
					pattern: /^\w+|(\s)AS(?=\s)/,
					lookbehind: true,
					greedy: true,
					alias: 'keyword'
				},
				'option': {
					pattern: RegExp(/(^\s+)--[\w-]+=(?:<str>|(?!["'])(?:[^\s\\]|\\.)+)/.source.replace(/<str>/g, function () { return string.source })),
					lookbehind: true,
					inside: {
						'property': /^--[\w-]+/,
						'attr-value': {
							pattern: /^(=)[\s\S]+/,
							lookbehind: true
						},
						'punctuation': /=/
					}
				},
				'comment': commentRule,
				'string': {
					pattern: string,
					greedy: true
				},
				'variable': /\$(?:\w+|\{[^{}"'\\]*\})/,
				'operator': /\\$/m,
				// punctuation for JSON arrays
				'punctuation': {
					pattern: /("\s*)/
				}
			}
		},
		'comment': commentRule
	};

	Prism.languages.dockerfile = Prism.languages.docker;

}(Prism));
