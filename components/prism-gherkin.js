// TODO:
// 		- Support for outline parameters
// 		- Support for tables

Prism.languages.gherkin = {
	'comment': {
		pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|((#)|(\/\/)).*?(\r?\n|$))/,
		lookbehind: true
	},
	'string': /("|')(\\?.)*?\1/,
	'atrule': /\b(And|Given|When|Then|In order to|As an|I want to|As a)\b/,
	'keyword': /\b(Scenario Outline|Scenario|Feature|Background|Story)\b/
};
