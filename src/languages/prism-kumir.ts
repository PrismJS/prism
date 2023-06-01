/* eslint-disable regexp/no-dupe-characters-character-class */
import type { LanguageProto } from '../types';

export default {
	id: 'kumir',
	alias: 'kum',
	grammar() {
		/**
		 * Regular expression for characters that are not allowed in identifiers.
		 */
		const nonId = /\s\x00-\x1f\x22-\x2f\x3a-\x3f\x5b-\x5e\x60\x7b-\x7e/.source;

		/**
		 * Surround a regular expression for IDs with patterns for non-ID sequences.
		 *
		 * @param pattern A regular expression for identifiers.
		 * @param flags The regular expression flags.
		 * @returns A wrapped regular expression for identifiers.
		 */
		function wrapId(pattern: string, flags?: string) {
			return RegExp(pattern.replace(/<nonId>/g, nonId), flags);
		}

		return {
			'comment': {
				pattern: /\|.*/
			},

			'prolog': {
				pattern: /#.*/,
				greedy: true
			},

			'string': {
				pattern: /"[^\n\r"]*"|'[^\n\r']*'/,
				greedy: true
			},

			'boolean': {
				pattern: wrapId(/(^|[<nonId>])(?:да|нет)(?=[<nonId>]|$)/.source),
				lookbehind: true
			},

			'operator-word': {
				pattern: wrapId(/(^|[<nonId>])(?:и|или|не)(?=[<nonId>]|$)/.source),
				lookbehind: true,
				alias: 'keyword'
			},

			'system-variable': {
				pattern: wrapId(/(^|[<nonId>])знач(?=[<nonId>]|$)/.source),
				lookbehind: true,
				alias: 'keyword'
			},

			'type': [
				{
					pattern: wrapId(/(^|[<nonId>])(?:вещ|лит|лог|сим|цел)(?:\x20*таб)?(?=[<nonId>]|$)/.source),
					lookbehind: true,
					alias: 'builtin'
				},
				{
					pattern: wrapId(/(^|[<nonId>])(?:компл|сканкод|файл|цвет)(?=[<nonId>]|$)/.source),
					lookbehind: true,
					alias: 'important'
				}
			],

			/**
			 * Should be performed after searching for type names because of "таб".
			 * "таб" is a reserved word, but never used without a preceding type name.
			 * "НАЗНАЧИТЬ", "Фввод", and "Фвывод" are not reserved words.
			 */
			'keyword': {
				pattern: wrapId(/(^|[<nonId>])(?:алг|арг(?:\x20*рез)?|ввод|ВКЛЮЧИТЬ|вс[её]|выбор|вывод|выход|дано|для|до|дс|если|иначе|исп|использовать|кон(?:(?:\x20+|_)исп)?|кц(?:(?:\x20+|_)при)?|надо|нач|нс|нц|от|пауза|пока|при|раза?|рез|стоп|таб|то|утв|шаг)(?=[<nonId>]|$)/.source),
				lookbehind: true
			},

			/** Should be performed after searching for reserved words. */
			'name': {
				// eslint-disable-next-line regexp/no-super-linear-backtracking
				pattern: wrapId(/(^|[<nonId>])[^\d<nonId>][^<nonId>]*(?:\x20+[^<nonId>]+)*(?=[<nonId>]|$)/.source),
				lookbehind: true
			},

			/** Should be performed after searching for names. */
			'number': {
				pattern: wrapId(/(^|[<nonId>])(?:\B\$[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)(?=[<nonId>]|$)/.source, 'i'),
				lookbehind: true
			},

			/** Should be performed after searching for words. */
			'punctuation': /:=|[(),:;\[\]]/,

			/**
			 * Should be performed after searching for
			 * - numeric constants (because of "+" and "-");
			 * - punctuation marks (because of ":=" and "=").
			 */
			'operator-char': {
				pattern: /\*\*?|<[=>]?|>=?|[-+/=]/,
				alias: 'operator'
			}
		};
	}
} as LanguageProto<'kumir'>;
