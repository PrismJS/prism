(function(Prism) {
	Prism.languages.eta = {
		delimiter: {
			pattern: /^<%[-_=]?(?:\s*(?:=|~))?|[-_]?%>$/,
			alias: "punctuation"
		},
		"language-javascript": {
			pattern: /[\s\S]+/,
			inside: Prism.languages.javascript
		}
	};

	Prism.hooks.add("before-tokenize", function(env) {
		var etaPattern = /<%(?:-|_)?\s*(?:=|~)?\s*(?:(?:[^]*?(?:'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'|`(?:\\[\s\w"'\\`]|[^\\`])*?`|"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"|\/\*[^]*?\*\/)?)*?)\s*(?:-|_)?%>/g;
		Prism.languages["markup-templating"].buildPlaceholders(
			env,
			"eta",
			etaPattern
		);
	});

	Prism.hooks.add("after-tokenize", function(env) {
		Prism.languages["markup-templating"].tokenizePlaceholders(env, "eta");
	});
})(Prism);
