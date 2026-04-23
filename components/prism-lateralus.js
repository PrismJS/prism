(function (Prism) {

	Prism.languages.lateralus = {
		'comment': [
			{
				// nested block comments /* ... /* ... */ ... */
				pattern: /\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|\/\*(?:[^*/]|\*(?!\/)|\/(?!\*))*\*\/)*\*\//,
				greedy: true
			},
			{
				pattern: /\/\/\/.*/,
				alias: 'doc-comment',
				greedy: true
			},
			{
				pattern: /\/\/.*/,
				greedy: true
			}
		],
		'string': [
			{
				// raw strings: r"..." and r#"..."#, r##"..."##
				pattern: /b?r(#*)"(?:\\.|(?!"\1)[^\\])*"\1/,
				greedy: true,
				alias: 'raw-string'
			},
			{
				// byte string b"..."
				pattern: /b"(?:\\.|[^"\\\r\n])*"/,
				greedy: true
			},
			{
				// regular / interpolated strings
				pattern: /"(?:\\.|[^"\\\r\n])*"/,
				greedy: true,
				inside: {
					'interpolation': {
						pattern: /\{[^{}]*\}/,
						inside: {
							'interpolation-punctuation': {
								pattern: /^\{|\}$/,
								alias: 'punctuation'
							},
							rest: null // filled below
						}
					}
				}
			}
		],
		'char': {
			// 'a', '\n', '\u{1F600}', b'x'
			pattern: /b?'(?:\\(?:x[0-9a-fA-F]{2}|u\{[0-9a-fA-F]{1,6}\}|.)|[^'\\\r\n])'/,
			greedy: true
		},
		'attribute': {
			// #[caps(io, net)], @decorator
			pattern: /#!?\[[^\]\r\n]*\]|@[a-zA-Z_]\w*/,
			alias: 'attr-name',
			inside: {
				'punctuation': /^#!?\[|\]$|^@/,
				'string': {
					pattern: /"(?:\\.|[^"\\\r\n])*"/,
					greedy: true
				}
			}
		},
		'keyword': /\b(?:actor|as|async|await|break|capability|case|class|const|continue|defer|do|effect|else|enum|export|extern|fn|for|handle|if|impl|import|in|interface|let|loop|match|module|move|mut|of|pub|return|self|spawn|static|struct|super|switch|trait|type|union|unsafe|use|var|when|where|while|with|yield)\b/,
		'builtin-type': {
			pattern: /\b(?:Any|Arc|Array|Box|HashMap|HashSet|List|Map|Option|Rc|Ref|RefMut|Result|Set|Slice|Tuple|Vec|bool|byte|bytes|char|f128|f16|f32|f64|i128|i16|i32|i64|i8|isize|never|str|string|u128|u16|u32|u64|u8|usize|void)\b/,
			alias: 'keyword'
		},
		'constant': /\b(?:Err|None|Ok|Self|Some|false|nil|true)\b/,
		'class-name': [
			// Type after : or -> or in struct/enum/trait/type/impl declarations
			{
				pattern: /\b(?:actor|class|enum|impl|interface|struct|trait|type|union)\s+(?!\d)[A-Z]\w*/,
				inside: {
					'keyword': /^\w+/
				}
			},
			{
				// PascalCase identifiers and module paths Foo::Bar
				pattern: /\b[A-Z]\w*(?:::[A-Z]\w*)*\b/
			}
		],
		'function': {
			pattern: /\b(?!\d)\w+(?=\s*(?:::\s*<|\())/,
			greedy: true
		},
		'macro': {
			pattern: /\b(?!\d)\w+!(?=\s*[({\[])/,
			alias: 'property'
		},
		'lifetime': {
			pattern: /'(?!(?:\\(?:x[0-9a-fA-F]{2}|u\{[0-9a-fA-F]{1,6}\}|.)|[^'\\\r\n])')(?!\d)\w+/,
			alias: 'symbol'
		},
		'number': /\b(?:0x[a-fA-F0-9](?:_?[a-fA-F0-9])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:\d(?:_?\d)*)(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?)(?:_?(?:f(?:16|32|64|128)|i(?:8|16|32|64|128|size)|u(?:8|16|32|64|128|size)))?\b/,
		'operator': /\|>|->|=>|<-|::|\.\.=?|[!=<>]=|&&|\|\||<<=?|>>=?|[-+*/%&|^!=<>?~]=?/,
		'punctuation': /[{}[\];(),.:@]/
	};

	// Fill self-referential string interpolation
	Prism.languages.lateralus['string'][2].inside['interpolation'].inside.rest = Prism.languages.lateralus;

	Prism.languages.ltl = Prism.languages.lateralus;
	Prism.languages.lat = Prism.languages.lateralus;

}(Prism));
