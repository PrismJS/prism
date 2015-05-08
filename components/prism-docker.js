Prism.languages.docker = {
	'keyword': {
    pattern: /^\s*\b(ONBUILD|FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|COPY|VOLUME|USER|WORKDIR|CMD|ENTRYPOINT)\b\s/mi
	},
  'string': /("|')(\\\n|\\?.)*?\1/,
	'comment': /#[^\n]+/,
  'punctuation': /([:[\]{}\-,|>?]|---|\.\.\.)/
};
