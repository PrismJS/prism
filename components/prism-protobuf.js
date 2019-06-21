(function (Prism) {

	var primitives = /\b(?:double|float|int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|bool|string|bytes)\b/;

	Prism.languages.protobuf = Prism.languages.extend('clike', {
		'class-name': {
			pattern: /(\b(?:enum|extend|message|service)\s+)[A-Za-z_]\w*(?=\s*\{)/,
			lookbehind: true
		},
		'keyword': [
			/\b(?:(?:enum|extend|message|oneof|package|service)(?=\s+(?:$|\w))|extensions|import|option|public|syntax)\b/,
			RegExp(/\bto(?=\s+(?:max\b|__))/.source.replace('__', Prism.languages.clike.number.source))
		],
		'builtin': /\b(?:optional|repeated|required|reserved)\b/,
	});

	Prism.languages.insertBefore('protobuf', 'operator', {
		'map': {
			pattern: /\bmap<\s*[\w.]+\s*,\s*[\w.]+\s*>(?=\s+[A-Za-z_]\w*\s*[=;])/,
			alias: 'class-name',
			inside: {
				'punctuation': /[<>.,]/,
				'primitives': {
					pattern: primitives,
					alias: 'symbol'
				}
			}
		},
		'primitive': {
			pattern: primitives,
			alias: 'symbol'
		},
		'positional-class-name': {
			pattern: /(?:\b|\B\.)[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*(?=\s+[A-Za-z_]\w*\s*[=;])/,
			alias: 'class-name',
			inside: {
				'punctuation': /\./
			}
		},
		'annotation': {
			pattern: /(\[\s*)[A-Za-z_]\w*(?=\s*=)/,
			lookbehind: true
		}
	});

}(Prism));
