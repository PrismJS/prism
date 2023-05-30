import { insertBefore } from '../shared/language-util';
import clike from './prism-clike';
import type { GrammarToken, LanguageProto } from '../types';

export default {
	id: 'c',
	require: clike,
	optional: 'opencl-extensions',
	grammar({ extend, getOptionalLanguage }) {
		const c = extend('clike', {
			'comment': {
				pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
				greedy: true
			},
			'string': {
				// https://en.cppreference.com/w/c/language/string_literal
				pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
				greedy: true
			},
			'class-name': {
				pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
				lookbehind: true
			},
			'keyword': /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
			'function': /\b[a-z_]\w*(?=\s*\()/i,
			'number': /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
			'operator': />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/
		});

		insertBefore(c, 'string', {
			'char': {
				// https://en.cppreference.com/w/c/language/character_constant
				pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
				greedy: true
			}
		});

		insertBefore(c, 'string', {
			'macro': {
				// allow for multiline macro definitions
				// spaces after the # character compile fine with gcc
				pattern: /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
				lookbehind: true,
				greedy: true,
				alias: 'property',
				inside: {
					'string': [
						{
							// highlight the path of the include statement as a string
							pattern: /^(#\s*include\s*)<[^>]+>/,
							lookbehind: true
						},
						c['string'] as GrammarToken
					],
					'char': c['char'],
					'comment': c['comment'],
					'macro-name': [
						{
							pattern: /(^#\s*define\s+)\w+\b(?!\()/i,
							lookbehind: true
						},
						{
							pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
							lookbehind: true,
							alias: 'function'
						}
					],
					// highlight macro directives as keywords
					'directive': {
						pattern: /^(#\s*)[a-z]+/,
						lookbehind: true,
						alias: 'keyword'
					},
					'directive-hash': /^#/,
					'punctuation': /##|\\(?=[\r\n])/,
					'expression': {
						pattern: /\S[\s\S]*/,
						inside: c
					}
				}
			}
		});

		insertBefore(c, 'function', {
			// highlight predefined macros as constants
			'constant': /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/
		});

		delete c['boolean'];

		/* OpenCL host API */
		const extensions = getOptionalLanguage('opencl-extensions');
		if (extensions) {
			insertBefore(c, 'keyword', extensions);
			delete c['type-opencl-host-cpp'];
		}

		return c;
	}
} as LanguageProto<'c'>;
