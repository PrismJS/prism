Prism.languages.markup = {
	'comment': /&lt;!--[\w\W]*?--(>|&gt;)/g,
	'script': null,
	'style': null,
	'tag': {
		pattern: /(&lt;|<)\/?[\w\W]+?(>|&gt;)/gi,
		inside: {
			'tag': {
				pattern: /^(&lt;|<)\/?[\w:-]+/i,
				inside: {
					'punctuation': /^(&lt;|<)\/?/,
					'namespace': /^[\w-]+?:/
				}
			},
			'attr-value': {
				pattern: /=(('|").*?(\2)|[^\s>]+)/gi,
				inside: {
					'punctuation': /=/g
				}
			},
			'punctuation': /\/?&gt;|\/?>/g,
			'attr-name': {
				pattern: /[\w:-]+/g,
				inside: {
					'namespace': /^[\w-]+?:/
				}
			}
			
		}
	},
	'entity': /&amp;#?[\da-z]{1,8};/gi
};

if (Prism.languages.javascript) {
	Prism.languages.markup.script = {
		pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/ig,
		inside: {
			'tag': {
				pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/ig,
				inside: Prism.languages.markup.tag.inside
			},
			rest: Prism.languages.javascript
		}
	};
}
else {
	delete Prism.languages.markup.script;
}

if (Prism.languages.css) {
	Prism.languages.markup.style = {
		pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/ig,
		inside: {
			'tag': {
				pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/ig,
				inside: Prism.languages.markup.tag.inside
			},
			rest: Prism.languages.css
		}
	};
}
else {
	delete Prism.languages.markup.style;
}