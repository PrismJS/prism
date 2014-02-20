Prism.languages.aspnet = Prism.languages.extend('markup', {
	'asp tag': {
		pattern: /(<|&lt;)%\s*@.*%>/gi,
		inside: {
			'page-directive': /&lt;%\s*@\s*(?:Assembly|Control|Implements|Import|Master|MasterType|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/ig,
			rest: Prism.languages.markup.tag.inside
		}
	},
	'asp directive': {
		pattern: /(<|&lt;)%.*%>/gi,
		inside: {
			'directive-tag': /(<|&lt;)%\s*?[$=%#:]{0,2}|%>/gi,
			
			
			rest: Prism.languages.csharp
		}
	}
});
/* match inline code inside of attribute value */
Prism.languages.insertBefore('inside', 'punctuation', {
	'asp directive': Prism.languages.aspnet.directive
}, Prism.languages.aspnet.tag.inside["attr-value"]);

Prism.languages.insertBefore('aspnet', 'comment', {
	'asp comment': /&lt;%--[\w\W]*?--%>/g
});

/* runat="server" contains csharp, not javascript */
Prism.languages.insertBefore('aspnet', Prism.languages.javascript ? 'script' : 'tag', {
	'asp script': {
		pattern: /(&lt;|<)script(?=.*runat=['"]server['"])[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/ig,
		inside: {
			'tag': {
				pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/ig,
				inside: Prism.languages.markup.tag.inside
			},
			rest: Prism.languages.csharp
		}
	}
});

// Hacks to fix lazy tag matching finishing too early: <script src="<% Blah.Url %>"> => <script src="<% Blah.Url %>
Prism.languages.aspnet.style.inside.tag.pattern = /&lt;\/?style\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|\w+))?\s*)*\/?>/gi;
Prism.languages.aspnet.style.inside.tag.inside = Prism.languages.aspnet.tag.inside;

Prism.languages.aspnet.script.inside.tag.pattern = /&lt;\/?script\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|\w+))?\s*)*\/?>/gi;
Prism.languages.aspnet.script.inside.tag.inside = Prism.languages.aspnet.tag.inside;