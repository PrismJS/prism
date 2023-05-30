import type { LanguageProto } from '../types';

export default {
	id: 'latex',
	alias: ['tex', 'context'],
	grammar() {
		const funcPattern = /\\(?:[^a-z()[\]]|[a-z*]+)/i;
		const insideEqu = {
			'equation-command': {
				pattern: funcPattern,
				alias: 'regex'
			}
		};

		return {
			'comment': /%.*/,
			// the verbatim environment prints whitespace to the document
			'cdata': {
				pattern: /(\\begin\{((?:lstlisting|verbatim)\*?)\})[\s\S]*?(?=\\end\{\2\})/,
				lookbehind: true
			},
			/*
				 * equations can be between $$ $$ or $ $ or \( \) or \[ \]
				 * (all are multiline)
				 */
			'equation': [
				{
					pattern: /\$\$(?:\\[\s\S]|[^\\$])+\$\$|\$(?:\\[\s\S]|[^\\$])+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/,
					inside: insideEqu,
					alias: 'string'
				},
				{
					pattern: /(\\begin\{((?:align|eqnarray|equation|gather|math|multline)\*?)\})[\s\S]*?(?=\\end\{\2\})/,
					lookbehind: true,
					inside: insideEqu,
					alias: 'string'
				}
			],
			/*
				 * arguments which are keywords or references are highlighted
				 * as keywords
				 */
			'keyword': {
				pattern: /(\\(?:begin|cite|documentclass|end|label|ref|usepackage)(?:\[[^\]]+\])?\{)[^}]+(?=\})/,
				lookbehind: true
			},
			'url': {
				pattern: /(\\url\{)[^}]+(?=\})/,
				lookbehind: true
			},
			/*
				 * section or chapter headlines are highlighted as bold so that
				 * they stand out more
				 */
			'headline': {
				pattern: /(\\(?:chapter|frametitle|paragraph|part|section|subparagraph|subsection|subsubparagraph|subsubsection|subsubsubparagraph)\*?(?:\[[^\]]+\])?\{)[^}]+(?=\})/,
				lookbehind: true,
				alias: 'class-name'
			},
			'function': {
				pattern: funcPattern,
				alias: 'selector'
			},
			'punctuation': /[[\]{}&]/
		};
	}
} as LanguageProto<'latex'>;
