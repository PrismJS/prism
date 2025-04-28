import { insertBefore } from '../shared/language-util';
import clike from './clike';
import type { GrammarToken, LanguageProto } from '../types';

export default {
	id: 'c',
	require: clike,
	extends: clike,
	optional: 'opencl-extensions',
	grammar ({ getOptionalLanguage }: GrammarOptions): Grammar {
		// TODO this should be done in the opencl-extensions language
		const extensions = getOptionalLanguage('opencl-extensions');

		return {
			'comment': {
				pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
				greedy: true,
			},
			'string': {
				// https://en.cppreference.com/w/c/language/string_literal
				pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
				greedy: true,
			},
			'class-name': {
				pattern:
					/(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
				lookbehind: true,
			},
			'keyword':
				/\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
			'function': /\b[a-z_]\w*(?=\s*\()/i,
			'number':
				/(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
			'operator': />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
			$insertBefore: {
				'string': {
					'char': {
						// https://en.cppreference.com/w/c/language/character_constant
						pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
						greedy: true,
					},
				},
				'macro': {
					// allow for multiline macro definitions
					// spaces after the # character compile fine with gcc
					pattern:
						/(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
					lookbehind: true,
					greedy: true,
					alias: 'property',
					inside: {
						'string': [
							{
								// highlight the path of the include statement as a string
								pattern: /^(#\s*include\s*)<[^>]+>/,
								lookbehind: true,
							},
							c['string'] as GrammarToken,
						],
						'char': c['char'],
						'comment': c['comment'],
						'macro-name': [
							{
								pattern: /(^#\s*define\s+)\w+\b(?!\()/i,
								lookbehind: true,
							},
							{
								pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
								lookbehind: true,
								alias: 'function',
							},
						],
						// highlight macro directives as keywords
						'directive': {
							pattern: /^(#\s*)[a-z]+/,
							lookbehind: true,
							alias: 'keyword',
						},
						'directive-hash': /^#/,
						'punctuation': /##|\\(?=[\r\n])/,
						'expression': {
							pattern: /\S[\s\S]*/,
							inside: c,
						},
					},
				},
				'function': {
					// highlight predefined macros as constants
					'constant':
						/\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/,
				},
				'keyword': extensions,
			},
			$delete: ['boolean', extensions ? 'type-opencl-host-cpp' : undefined],
		};
	},
} as LanguageProto<'c'>;
