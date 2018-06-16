Prism.languages.csharp = Prism.languages.extend('clike', {
	'keyword': /\b(?:abstract|add|alias|as|ascending|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|descending|do|double|dynamic|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|from|get|global|goto|group|if|implicit|in|int|interface|internal|into|is|join|let|lock|long|nameof|namespace|new|null|object|operator|orderby|out|override|params|partial|private|protected|public|readonly|ref|remove|return|sbyte|sealed|select|set|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|value|var|virtual|void|volatile|where|while|yield)\b/,
	'string': [
		{
			pattern: /@("|')(?:\1\1|\\[\s\S]|(?!\1)[^\\])*\1/,
			greedy: true
		},
		{
			pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*?\1/,
			greedy: true
		}
	],
	'class-name': [
		{
			// [Foo]
			pattern: /(\[)[A-Z]\w*(?:\.\w+)*\b/,
			lookbehind: true,
			inside: {
				punctuation: /\./
			}
		},
		{
			// class Foo
			pattern: /(\b(?:class|enum|interface|struct)\s+)[A-Z]\w*(?:\.\w+)*(?:<[^\r\n=;{]+?>(?:\.\w+)*)?/,
			lookbehind: true,
			inside: {
				punctuation: /[<>(),.:[\]]/
			}
		},
		{
			// catch(Foo)
			pattern: /(catch\s+\()[A-Z]\w*(?:\.\w+)*\b/,
			lookbehind: true,
			inside: {
				punctuation: /\./
			}
		},
		{
			// where Foo
			pattern: /(\bwhere\s+)[A-Z]\w*\b/,
			lookbehind: true
		}
	],
	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)f?/i
});

Prism.languages.insertBefore('csharp', 'class-name', {
	'type-expression': {
		// default(Foo), typeof(Foo<Bar>)
		pattern: /(\b(?:default|typeof)\(\s*)[A-Z]\w*(?:\.\w+)*(?:<[^\r\n=;{]+?>(?:\.\w+)*)?(?=\s*\))/,
		lookbehind: true,
		inside: {
			keyword: Prism.languages.csharp.keyword,
			'class-name': {
				pattern: /\b[A-Z]\w*(?:\.\w+)*\b/,
				inside: {
					punctuation: /\./
				}
			},
			punctuation: /[<>(),.:[\]]/
		}
	}
});

Prism.languages.insertBefore('csharp', 'class-name', {
	'constructor-invocation': {
		// new List<Foo<Bar[]>> { }
		pattern: /(\bnew\s+)[A-Z]\w*(?:\.\w+)*(?:<[^\r\n=;{]+?>(?:\.\w+)*)?\s*(?=[[({])/,
		lookbehind: true,
		inside: Prism.languages.csharp['type-expression'].inside
	},
	'generic-method': {
		// foo<Bar>()
		pattern: /\w+\s*<[^\r\n=;{]+?>\s*(?=\()/,
		inside: {
			function: /^\w+/,
			'class-name': {
				pattern: /\b[A-Z]\w*(?:\.\w+)*\b/,
				inside: {
					punctuation: /\./
				}
			},
			keyword: Prism.languages.csharp.keyword,
			punctuation: /[<>(),.:[\]]/
		}
	},
	'type-list': {
		// class Foo<F> : Bar, IList<FooBar>
		// where F : Bar, IList<int>
		pattern: /(\b(?:class|interface|struct|enum)\s+\w*(?:\.\w+)*(<[^\r\n=;{]+?>)?(?:\.\w+)*\s*:\s*|\bwhere\s+\w+\s*:\s*)(?:\w+(?:<[^\r\n=;{]+?>)?(?:\s*,)?\s*?)+(?=\s*(?:where|[{;]|=>))/,
		lookbehind: true,
		inside: Prism.languages.csharp['type-expression'].inside
	},
	'identifier-type': {
		// (Foo bar, Bar baz, Foo[,,] bay, Foo<Bar, FooBar<Bar>> bax)
		pattern: /\b[A-Z]\w*(?:\.\w+)*(?:<[^\r\n=;{]+?>(?:\.\w+)*)?(?=(?:\s*\[\s*(?:,\s*)*\])?\s+\w+\s*[=,;:{)])/,
		inside: Prism.languages.csharp['type-expression'].inside
	},
	'preprocessor': {
		pattern: /(^\s*)#.*/m,
		lookbehind: true,
		alias: 'property',
		inside: {
			// highlight preprocessor directives as keywords
			'directive': {
				pattern: /(\s*#)\b(?:define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/,
				lookbehind: true,
				alias: 'keyword'
			}
		}
	}
});

Prism.languages.dotnet = Prism.languages.csharp;