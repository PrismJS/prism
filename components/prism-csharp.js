(function (Prism) {

	var keywords = /\b(?:abstract|add|alias|as|ascending|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|descending|do|double|dynamic|else|enum|event|explicit|extern|finally|fixed|float|for|foreach|from|get|global|goto|group|if|implicit|in|int|interface|internal|into|is|join|let|lock|long|nameof|namespace|new|null|object|operator|orderby|out|override|params|partial|private|protected|public|readonly|ref|remove|return|sbyte|sealed|select|set|short|sizeof|stackalloc|static|string|struct|switch|this|throw|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|value|var|virtual|void|volatile|where|while|yield)\b/;

	var classNameInside = {
		'keyword': keywords,
		'punctuation': /[<>(),.:[\]]/
	};

	Prism.languages.csharp = Prism.languages.extend('clike', {
		'keyword': keywords,
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
				// (Foo bar, Bar baz, Foo[,,] bay, Foo<Bar, FooBar<Bar>> bax)
				pattern: /\b[A-Z]\w*(?:\.\w+)*(?:<(?:[^>\n=;{}]+|>(?=\s*[,.>?[)]))+>)?(?:\.\w+)*(?:\[\s*(?:,\s*)*\])*(?=\s+\w+(?:\s*[=,;:{)\]]|\s+in))/,
				inside: classNameInside
			},
			{
				// [Foo]
				pattern: /((?:^|\W)\[)[A-Z]\w*(?:\.\w+)*\b/,
				lookbehind: true,
				inside: {
					'punctuation': /\./
				}
			},
			{
				// class Foo<A, B>
				pattern: /(\b(?:class|enum|interface|struct)\s+)[A-Z]\w*(?:\s*<[^>]+>)?/,
				lookbehind: true,
				inside: {
					'punctuation': /[<>,]/
				}
			},
			{
				// catch(Foo)
				pattern: /(\bcatch\s*\()[A-Z]\w*(?:\.\w+)*\b/,
				lookbehind: true,
				inside: {
					'punctuation': /\./
				}
			},
			{
				// where Foo
				pattern: /(\bwhere\s+)[A-Z]\w*\b/,
				lookbehind: true
			},
			{
				// as Foo<A>, is Bar<B>
				pattern: /(\b(?:is|as)\s+)[A-Z]\w*(?:\.\w+)*(?:<(?:[^>\n=;{}]+|>(?=\s*[,.>?[)]))+>)?(?:\.\w+)*(?:\[\s*(?:,\s*)*\])*/,
				lookbehind: true,
				inside: classNameInside
			}
		],
		'number': /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|\B\.\d+|\b\d+(?:_+\d+)*\.?\d*)(?:ul|[flu])?\b/i
	});

	Prism.languages.insertBefore('csharp', 'class-name', {
		'type-expression': {
			// default(Foo), typeof(Foo<Bar>)
			pattern: /(\b(?:default|typeof)\(\s*)[A-Z]\w*(?:\.\w+)*(?:<(?:[^>\n=;{}]+|>(?=\s*[,.>?[]))+>)?(?:\.\w+)*(?:\[\s*(?:,\s*)*\])*(?=\s*\))/,
			lookbehind: true,
			inside: classNameInside,
			alias: 'class-name'
		},
		'constructor-invocation': {
			// new List<Foo<Bar[]>> { }
			pattern: /(\bnew\s+)[A-Z]\w*(?:\.\w+)*(?:<(?:[^>\n=;{}]+|>(?=\s*[,.>?[)]))+>)?(?:\.\w+)*(?:\[\s*(?:,\s*)*\])*(?=\s*[[({])/,
			lookbehind: true,
			inside: classNameInside,
			alias: 'class-name'
		},
		'return-type': {
			// Foo<Bar> ForBar(), Foo IFoo.Bar() => 0
			pattern: /\b[A-Z]\w*(?:\.\w+)*(?:<[^\n=;{]+?>(?:\.\w+)*)?(?:\[\s*(,\s*)*\])?(?=\s+(?:[A-Z]\w*\.)?(?:\w+(?:\s*<[^\n=;{]+?>)?\s*(?:[({]|=>)|this\s*\[))/,
			inside: classNameInside,
			alias: 'class-name'
		},
		'generic-method': {
			// foo<Bar>()
			pattern: /\w+\s*<[^\n=;{)]+?>(?=\s*\()/,
			inside: {
				'function': /^\w+/,
				'class-name': {
					pattern: /\b[A-Z]\w*(?:\.\w+)*\b/,
					inside: {
						'punctuation': /\./
					}
				},
				'keyword': keywords,
				'punctuation': /[<>(),.:[\]]/
			}
		},
		'type-list': {
			// ( class Foo<F> ) : Bar, IList<FooBar>
			// ( where F ) : Bar, IList<int>
			pattern: /(\b(?:class|interface|struct|enum)\s+[A-Z]\w*(?:\s*<[^>]+>)?\s*:\s*|\bwhere\s+\w+\s*:\s*)(?:\w+(?:<[^\r\n=;{]+?>)?(?:\s*,)?\s*?)+(?=\s*(?:where|[{;]|=>))/,
			lookbehind: true,
			inside: {
				'keyword': keywords,
				'class-name': {
					pattern: /\b[A-Z]\w*(?:\.\w+)*\b/,
					inside: {
						'punctuation': /\./
					}
				},
				'punctuation': /[<>(),.:[\]]/
			}
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
}(Prism));

Prism.languages.dotnet = Prism.languages.csharp;
