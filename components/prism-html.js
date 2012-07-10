Prism.languages.html = {
	'comment': /&lt;!--[\w\W]*?--(>|&gt;)/g,
	'script': null,
	'style': null,
	'tag': {
		pattern: /(&lt;|<)\/?[\w\W]+?(>|&gt;)/gi,
		inside: {
			'attr-value': {
				pattern: /[\w:-]+=(('|").*?(\2)|[^\s>]+(?=\/?>|\/?&gt;|\s))/gi,
				inside: {
					'attr-name': /^[\w:-]+(?==)/gi,
					'punctuation': /=/g
				}
			},
			'attr-name': /\s[\w:-]+(?=\s|>|&gt;)/gi,
			'punctuation': /&lt;\/?|\/?&gt;|<\/?|\/?>/g
		}
	},
	'entity': /&amp;#?[\da-z]{1,8};/gi
};

if (Prism.languages.javascript) {
	Prism.languages.html.script = {
		pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/ig,
		inside: {
			'tag': {
				pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/ig,
				inside: Prism.languages.html.tag.inside
			},
			rest: Prism.languages.javascript
		}
	};
}
else {
	delete Prism.languages.html.script;
}

if (Prism.languages.css) {
	Prism.languages.html.style = {
		pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/ig,
		inside: {
			'tag': {
				pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/ig,
				inside: Prism.languages.html.tag.inside
			},
			rest: Prism.languages.css
		}
	};
}
else {
	delete Prism.languages.html.style;
}