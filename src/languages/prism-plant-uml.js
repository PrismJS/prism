export default /** @type {import("../types").LanguageProto} */ ({
	id: 'plant-uml',
	alias: 'plantuml',
	grammar() {
		let variable = /\$\w+|%[a-z]+%/;

		let arrowAttr = /\[[^[\]]*\]/.source;
		let arrowDirection = /(?:[drlu]|do|down|le|left|ri|right|up)/.source;
		let arrowBody = '(?:-+' + arrowDirection + '-+|\\.+' + arrowDirection + '\\.+|-+(?:' + arrowAttr + '-*)?|' + arrowAttr + '-+|\\.+(?:' + arrowAttr + '\\.*)?|' + arrowAttr + '\\.+)';
		let arrowLeft = /(?:<{1,2}|\/{1,2}|\\{1,2}|<\||[#*^+}xo])/.source;
		let arrowRight = /(?:>{1,2}|\/{1,2}|\\{1,2}|\|>|[#*^+{xo])/.source;
		let arrowPrefix = /[[?]?[ox]?/.source;
		let arrowSuffix = /[ox]?[\]?]?/.source;
		let arrow =
				arrowPrefix +
				'(?:' +
				arrowBody + arrowRight +
				'|' +
				arrowLeft + arrowBody + '(?:' + arrowRight + ')?' +
				')' +
				arrowSuffix;

		return {
			'comment': {
				pattern: /(^[ \t]*)(?:'.*|\/'[\s\S]*?'\/)/m,
				lookbehind: true,
				greedy: true
			},
			'preprocessor': {
				pattern: /(^[ \t]*)!.*/m,
				lookbehind: true,
				greedy: true,
				alias: 'property',
				inside: {
					'variable': variable
				}
			},
			'delimiter': {
				pattern: /(^[ \t]*)@(?:end|start)uml\b/m,
				lookbehind: true,
				greedy: true,
				alias: 'punctuation'
			},

			'arrow': {
				pattern: RegExp(/(^|[^-.<>?|\\[\]ox])/.source + arrow + /(?![-.<>?|\\\]ox])/.source),
				lookbehind: true,
				greedy: true,
				alias: 'operator',
				inside: {
					'expression': {
						pattern: /(\[)[^[\]]+(?=\])/,
						lookbehind: true,
						inside: null // see below
					},
					'punctuation': /\[(?=$|\])|^\]/
				}
			},

			'string': {
				pattern: /"[^"]*"/,
				greedy: true
			},
			'text': {
				pattern: /(\[[ \t]*[\r\n]+(?![\r\n]))[^\]]*(?=\])/,
				lookbehind: true,
				greedy: true,
				alias: 'string'
			},

			'keyword': [
				{
					pattern: /^([ \t]*)(?:abstract\s+class|end\s+(?:box|fork|group|merge|note|ref|split|title)|(?:fork|split)(?:\s+again)?|activate|actor|agent|alt|annotation|artifact|autoactivate|autonumber|backward|binary|boundary|box|break|caption|card|case|circle|class|clock|cloud|collections|component|concise|control|create|critical|database|deactivate|destroy|detach|diamond|else|elseif|end|end[hr]note|endif|endswitch|endwhile|entity|enum|file|folder|footer|frame|group|[hr]?note|header|hexagon|hide|if|interface|label|legend|loop|map|namespace|network|newpage|node|nwdiag|object|opt|package|page|par|participant|person|queue|rectangle|ref|remove|repeat|restore|return|robust|scale|set|show|skinparam|stack|start|state|stop|storage|switch|title|together|usecase|usecase\/|while)(?=\s|$)/m,
					lookbehind: true,
					greedy: true
				},
				/\b(?:elseif|equals|not|while)(?=\s*\()/,
				/\b(?:as|is|then)\b/
			],

			'divider': {
				pattern: /^==.+==$/m,
				greedy: true,
				alias: 'important'
			},

			'time': {
				pattern: /@(?:\d+(?:[:/]\d+){2}|[+-]?\d+|:[a-z]\w*(?:[+-]\d+)?)\b/i,
				greedy: true,
				alias: 'number'
			},

			'color': {
				pattern: /#(?:[a-z_]+|[a-fA-F0-9]+)\b/,
				alias: 'symbol'
			},
			'variable': variable,

			'punctuation': /[:,;()[\]{}]|\.{3}/
		};

		Prism.languages['plant-uml'].arrow.inside.expression.inside = Prism.languages['plant-uml'];
	}
});
