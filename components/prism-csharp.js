(function (Prism) {

	/**
	 * Replaces all placeholders "<<n>>" of given expression with the n-th replacement (zero based).
	 *
	 * Note: Only the flags of the expression are kept. The flags of replacements will be ignored.
	 *
	 * Note: This is a simple text based replacement. Be careful when using backreferences!
	 *
	 * @param {RegExp} regex the given expression.
	 * @param {RegExp[]} replacements a list of replacement which can be inserted into the given expression.
	 * @returns {RegExp} the expression with all placeholders replaced with their corresponding replacements.
	 * @example replace(/a<<0>>a/i, /(?:b+)/) === /ab+a/i
	 */
	function replace(regex) {
		var replacements = arguments;
		return RegExp(regex.source.replace(/<<(\d+)>>/g, function (m, index) {
			return replacements[(+index) + 1].source;
		}), regex.toString().match(/[gimuy]*$/)[0]);
	}


	var keywords = /\b(?:abstract|add|alias|as|ascending|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|descending|do|double|dynamic|else|enum|event|explicit|extern|finally|fixed|float|for|foreach|from|get|global|goto|group|if|implicit|in|int|interface|internal|into|is|join|let|lock|long|nameof|namespace|new|null|object|operator|orderby|out|override|params|partial|private|protected|public|readonly|ref|remove|return|sbyte|sealed|select|set|short|sizeof|stackalloc|static|string|struct|switch|this|throw|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|value|var|virtual|void|volatile|where|while|yield)\b/;

	var classNameInside = {
		'keyword': keywords,
		'punctuation': /[<>(),.:[\]]/
	};


	var genericParameters = /(?:<(?:[^<>]|<(?:[^<>]|<(?:[^<>]|<[^<>]+>)+>)+>)+>)/;

	var className = replace(/(?:[A-Z]\w*(?:\.\w+)*(?:<<0>>(?:\.\w+)*)*)/, genericParameters);
	var classNamePlusArray = replace(/(?:<<0>>)(?:\[\s*(?:,\s*)*\])*/, className);
	var classNamePlusArrayOrKeyword = replace(/(?:<<0>>|[a-z]+)/, className);

	var methodOrPropertyDeclaration = /(?:\w+(?:\s*<[^<>]+>)?\s*(?:[({]|=>)|this\s*\[)/;

	var typeDeclarationKeywords = /(?:class|enum|interface|struct)/;


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
				// Attributes
				// [Foo], [Foo(Bar)]
				pattern: /((?:^|\W)\[)[A-Z]\w*(?:\.\w+)*\b/,
				lookbehind: true,
				inside: {
					'punctuation': /\./
				}
			},
			{
				// Using static
				// using static System.Math;
				pattern: replace(/(\busing\s+static\s+)<<0>>(?=\s*;)/, className),
				lookbehind: true,
				inside: classNameInside
			},
			{
				// Using alias (type)
				// using Project = PC.MyCompany.Project;
				pattern: replace(/(\busing\s+[A-Z]\w*\s*=\s*)<<0>>(?=\s*;)/, className),
				lookbehind: true,
				inside: classNameInside
			},
			{
				// Using alias (alias)
				// using Project = PC.MyCompany.Project;
				pattern: /(\busing\s+)[A-Z]\w*(?=\s*=)/,
				lookbehind: true
			},
			{
				// Type declarations
				// class Foo<A, B>
				pattern: replace(/(\b<<0>>\s+)[A-Z]\w*(?:\s*<[^<>]+>)?/, typeDeclarationKeywords),
				lookbehind: true,
				inside: {
					'punctuation': /[<>,]/,
					'keyword': /\b(?:in|out)\b/
				}
			},
			{
				// Single catch exception declaration
				// catch(Foo)
				// (things like catch(Foo e) is covered by variable declaration)
				pattern: /(\bcatch\s*\()[A-Z]\w*(?:\.\w+)*\b/,
				lookbehind: true,
				inside: {
					'punctuation': /\./
				}
			},
			{
				// Name of the type parameter of generic constraints
				// where Foo
				pattern: /(\bwhere\s+)[A-Z]\w*\b/,
				lookbehind: true
			},
			{
				// Casts and checks via as and is.
				// as Foo<A>, is Bar<B>
				// (things like if(a is Foo b) is covered by variable declaration)
				pattern: replace(/(\b(?:is|as)\s+)<<0>>/, classNamePlusArray),
				lookbehind: true,
				inside: classNameInside
			},
			{
				// Variable, field and parameter declaration
				// (Foo bar, Bar baz, Foo[,,] bay, Foo<Bar, FooBar<Bar>> bax)
				pattern: replace(/\b<<0>>(?=\s+[@\w]+(?:\s*[=,;:{)\]]|\s+in))/, classNamePlusArray),
				inside: classNameInside
			}
		],
		'number': /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:ul|[flu])?\b/i,
		'operator': />>=?|<<=?|[-=]>|([-+&|?])\1|~|[-+*/%&|^!=<>]=?/,
		'punctuation': /\?\.?|::|[{}[\];(),.:]/
	});

	Prism.languages.insertBefore('csharp', 'class-name', {
		'namespace': {
			pattern: /(\b(?:namespace|using)\s+)[A-Z]\w*(\.\w+)*(?=\s*[;{])/,
			lookbehind: true,
			inside: {
				'punctuation': /\./
			}
		},
		'type-expression': {
			// default(Foo), typeof(Foo<Bar>)
			pattern: /(\b(?:default|typeof)\s*\(\s*)[A-Z][^()]*?(?=\s*\))/,
			lookbehind: true,
			inside: classNameInside,
			alias: 'class-name'
		},
		'return-type': {
			// Foo<Bar> ForBar(), Foo IFoo.Bar() => 0
			pattern: replace(/\b<<0>>(?=\s+(?:<<1>>\.)?<<2>>)/, classNamePlusArray, className, methodOrPropertyDeclaration),
			inside: classNameInside,
			alias: 'class-name'
		},
		'constructor-invocation': {
			// new List<Foo<Bar[]>> { }
			pattern: replace(/(\bnew\s+)<<0>>(?=\s*[[({])/, classNamePlusArray),
			lookbehind: true,
			inside: classNameInside,
			alias: 'class-name'
		},
		/*'explicit-implementation': {
			// int IFoo<Foo>.Bar => 0; void IFoo<Foo<Foo>>.Foo<T>();
			pattern: replace(/\b<<0>>(?=\.<<1>>)/, className, methodOrPropertyDeclaration),
			inside: classNameInside,
			alias: 'class-name'
		},*/
		'generic-method': {
			// foo<Bar>()
			pattern: replace(/\w+\s*<<0>>(?=\s*\()/, genericParameters),
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
			// The list of types inherited or of generic constraints
			// ( class Foo<F> ) : Bar, IList<FooBar>
			// ( where F ) : Bar, IList<int>
			pattern: replace(/\b((?:<<1>>\s+[A-Z]\w*(?:\s*<[^<>]+>)?|where\s+\w+)\s*:\s*)<<0>>(?:\s*,\s*<<0>>)*(?=\s*(?:where|[{;]|=>|$))/, classNamePlusArrayOrKeyword, typeDeclarationKeywords),
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

Prism.languages.dotnet = Prism.languages.cs = Prism.languages.csharp;
