import clike from './clike';
import type { LanguageProto } from '../types';

export default {
	id: 'protobuf',
	base: clike,
	grammar () {
		const builtinTypes =
			/\b(?:bool|bytes|double|s?fixed(?:32|64)|float|[su]?int(?:32|64)|string)\b/;

		return {
			'class-name': [
				{
					pattern: /(\b(?:enum|extend|message|service)\s+)[A-Za-z_]\w*(?=\s*\{)/,
					lookbehind: true,
				},
				{
					pattern:
						/(\b(?:rpc\s+\w+|returns)\s*\(\s*(?:stream\s+)?)\.?[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*(?=\s*\))/,
					lookbehind: true,
				},
			],
			'keyword':
				/\b(?:enum|extend|extensions|import|message|oneof|option|optional|package|public|repeated|required|reserved|returns|rpc(?=\s+\w)|service|stream|syntax|to)\b(?!\s*=\s*\d)/,
			'function': /\b[a-z_]\w*(?=\s*\()/i,
			$insertBefore: {
				'operator': {
					'map': {
						pattern: /\bmap<\s*[\w.]+\s*,\s*[\w.]+\s*>(?=\s+[a-z_]\w*\s*[=;])/i,
						alias: 'class-name',
						inside: {
							'punctuation': /[<>.,]/,
							'builtin': builtinTypes,
						},
					},
					'builtin': builtinTypes,
					'positional-class-name': {
						pattern: /(?:\b|\B\.)[a-z_]\w*(?:\.[a-z_]\w*)*(?=\s+[a-z_]\w*\s*[=;])/i,
						alias: 'class-name',
						inside: {
							'punctuation': /\./,
						},
					},
					'annotation': {
						pattern: /(\[\s*)[a-z_]\w*(?=\s*=)/i,
						lookbehind: true,
					},
				},
			},
		};
	},
} as LanguageProto<'protobuf'>;
