import java from './java';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'scala',
	base: java,
	grammar () {
		return {
			'triple-quoted-string': {
				pattern: /"""[\s\S]*?"""/,
				greedy: true,
				alias: 'string',
			},
			'string': {
				pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
				greedy: true,
			},
			'keyword':
				/<-|=>|\b(?:abstract|case|catch|class|def|derives|do|else|enum|extends|extension|final|finally|for|forSome|given|if|implicit|import|infix|inline|lazy|match|new|null|object|opaque|open|override|package|private|protected|return|sealed|self|super|this|throw|trait|transparent|try|type|using|val|var|while|with|yield)\b/,
			'number': /\b0x(?:[\da-f]*\.)?[\da-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e\d+)?[dfl]?/i,
			'builtin':
				/\b(?:Any|AnyRef|AnyVal|Boolean|Byte|Char|Double|Float|Int|Long|Nothing|Short|String|Unit)\b/,
			'symbol': /'[^\d\s\\]\w*/,
			$insert: {
				'string-interpolation': {
					$before: 'triple-quoted-string',
					pattern:
						/\b[a-z]\w*(?:"""(?:[^$]|\$(?:[^{]|\{(?:[^{}]|\{[^{}]*\})*\}))*?"""|"(?:[^$"\r\n]|\$(?:[^{]|\{(?:[^{}]|\{[^{}]*\})*\}))*")/i,
					greedy: true,
					inside: {
						'id': {
							pattern: /^\w+/,
							greedy: true,
							alias: 'function',
						},
						'escape': {
							pattern: /\\\$"|\$[$"]/,
							greedy: true,
							alias: 'symbol',
						},
						'interpolation': {
							pattern: /\$(?:\w+|\{(?:[^{}]|\{[^{}]*\})*\})/,
							greedy: true,
							inside: {
								'punctuation': /^\$\{?|\}$/,
								'expression': {
									pattern: /[\s\S]+/,
									inside: 'scala',
								},
							},
						},
						'string': /[\s\S]+/,
					},
				},
			},
			$delete: ['doc-comment', 'class-name', 'function', 'constant'],
		} as unknown as Grammar;
	},
} as LanguageProto<'scala'>;
