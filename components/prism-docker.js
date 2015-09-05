Prism.languages.docker = {
	'keyword': {
		pattern: /(^\s*)(?:ONBUILD|FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|COPY|VOLUME|USER|WORKDIR|CMD|LABEL|ENTRYPOINT)(?=\s)/mi,
		lookbehind: true
	},
	'string': /("|')(\\\n|\\?.)*?\1/,
	'comment': /#.*/,
	'punctuation': /([:[\]{}\-,|>?]|---|\.\.\.)/
};
