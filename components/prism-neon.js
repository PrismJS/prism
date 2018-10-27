(function(Prism) {

	var variable = /%[\w.-]*%/;

	Prism.languages.neon = {
		entity: {
			pattern: /(?:(?:[^#"',:=[\]{}()\x00-\x20!`-]|[:-][^"',\]})\s])(?:[^,:=\]})(\x00-\x20]+|:(?![\s,\]})]|$)|[ \t]+[^#,:=\]})(\x00-\x20])*|(["'])(?:\\.|(?!\1)[^\\\r\n])*\1)(?=[ \t]*\()/,
			alias: 'entity',
			inside: {
				string: /^(["'])(?:\\.|(?!\1)[^\\\r\n])*\1$/,
				keyword: /.+/
			}
		},
		keyword: {
			pattern: /(?:(?:[^#"',:=[\]{}()\x00-\x20!`-]|[:-][^"',\]})\s])(?:[^,:=\]})(\x00-\x20]+|:(?![\s,\]})]|$)|[ \t]+[^#,:=\]})(\x00-\x20])*|(["'])(?:\\.|(?!\1)[^\\\r\n])*\1)(?=[ \t]*[=:])/,
			alias: 'key'
		},
		string: [
			{
				pattern: /("""|''')\n(?:(?:[^\n]|\n(?![ \t]*\1))*\n)?[ \t]*\1/,
				greedy: true,
				inside: {
					variable: variable
				}
			},
			{
				pattern: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
				greedy: true,
				inside: {
					variable: variable
				}
			}
		],
		comment: /#.*/,
		literal: {
			pattern: /(?:[^#"',:=[\]{}()\x00-\x20!`-]|[:-][^"',\]})\s])(?:[^,:=\]})(\x00-\x20]+|:(?![\s,\]})]|$)|[ \t]+[^#,:=\]})(\x00-\x20])*/,
			greedy: true,
			inside: {
				keyword: [
					{
						pattern: /^(?:true|True|TRUE|on|On|ON|yes|Yes|YES|false|False|FALSE|off|Off|OFF|no|No|NO)$/,
						alias: 'boolean'
					},
					{
						pattern: /^(?:null|Null|NULL)$/
					}
				],
				number: /^(?:\b0x[\dA-Fa-f]+|\b0o[0-7]+|\b0b[01]+|[-+]?(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][-+]?\d+)?)$/,
				string: {
					pattern: /.+/,
					inside: {
						variable: variable
					}
				}
			}
		},
		variable: variable,
		punctuation: /[-:=,()[\]{}]/
	};

}(Prism));