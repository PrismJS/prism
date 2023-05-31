import { insertBefore } from '../shared/language-util';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'http',
	optional: 'json',
	grammar({ getOptionalLanguage }) {
		function headerValueOf(name: string) {
			return RegExp('(^(?:' + name + '):[ \t]*(?![ \t]))[^]+', 'i');
		}

		const http = {
			'request-line': {
				pattern: /^(?:CONNECT|DELETE|GET|HEAD|OPTIONS|PATCH|POST|PRI|PUT|SEARCH|TRACE)\s(?:https?:\/\/|\/)\S*\sHTTP\/[\d.]+/m,
				inside: {
					// HTTP Method
					'method': {
						pattern: /^[A-Z]+\b/,
						alias: 'property'
					},
					// Request Target e.g. http://example.com, /path/to/file
					'request-target': {
						pattern: /^(\s)(?:https?:\/\/|\/)\S*(?=\s)/,
						lookbehind: true,
						alias: 'url',
						inside: 'uri'
					},
					// HTTP Version
					'http-version': {
						pattern: /^(\s)HTTP\/[\d.]+/,
						lookbehind: true,
						alias: 'property'
					},
				}
			},
			'response-status': {
				pattern: /^HTTP\/[\d.]+ \d+ .+/m,
				inside: {
					// HTTP Version
					'http-version': {
						pattern: /^HTTP\/[\d.]+/,
						alias: 'property'
					},
					// Status Code
					'status-code': {
						pattern: /^(\s)\d+(?=\s)/,
						lookbehind: true,
						alias: 'number'
					},
					// Reason Phrase
					'reason-phrase': {
						pattern: /^(\s).+/,
						lookbehind: true,
						alias: 'string'
					}
				}
			},
			'header': {
				pattern: /^[\w-]+:.+(?:(?:\r\n?|\n)[ \t].+)*/m,
				inside: {
					'header-value': [
						{
							pattern: headerValueOf(/Content-Security-Policy/.source),
							lookbehind: true,
							alias: ['csp', 'languages-csp'],
							inside: 'csp'
						},
						{
							pattern: headerValueOf(/Public-Key-Pins(?:-Report-Only)?/.source),
							lookbehind: true,
							alias: ['hpkp', 'languages-hpkp'],
							inside: 'hpkp'
						},
						{
							pattern: headerValueOf(/Strict-Transport-Security/.source),
							lookbehind: true,
							alias: ['hsts', 'languages-hsts'],
							inside: 'hsts'
						},
						{
							pattern: headerValueOf(/[^:]+/.source),
							lookbehind: true
						}
					],
					'header-name': {
						pattern: /^[^:]+/,
						alias: 'keyword'
					},
					'punctuation': /^:/
				}
			}
		};

		// Create a mapping of Content-Type headers to language definitions
		const httpLanguages = {
			'application/javascript': 'javascript',
			'application/json': getOptionalLanguage('json') || 'javascript',
			'application/xml': 'xml',
			'text/xml': 'xml',
			'text/html': 'html',
			'text/css': 'css',
			'text/plain': 'plain'
		};

		// Declare which types can also be suffixes
		const suffixTypes: Partial<Record<keyof typeof httpLanguages, boolean>> = {
			'application/json': true,
			'application/xml': true
		};

		/**
		 * Returns a pattern for the given content type which matches it and any type which has it as a suffix.
		 */
		function getSuffixPattern(contentType: string) {
			const suffix = contentType.replace(/^[a-z]+\//, '');
			const suffixPattern = '\\w+/(?:[\\w.-]+\\+)+' + suffix + '(?![+\\w.-])';
			return '(?:' + contentType + '|' + suffixPattern + ')';
		}

		// Insert each content type parser that has its associated language
		// currently loaded.
		const options: Grammar = {};
		for (const key in httpLanguages) {
			const contentType = key as keyof typeof httpLanguages;

			const pattern = suffixTypes[contentType] ? getSuffixPattern(contentType) : contentType;
			options[contentType.replace(/\//g, '-')] = {
				pattern: RegExp(
					'(' + /content-type:\s*/.source + pattern + /(?:(?:\r\n?|\n)[\w-].*)*(?:\r(?:\n|(?!\n))|\n)/.source + ')' +
					// This is a little interesting:
					// The HTTP format spec required 1 empty line before the body to make everything unambiguous.
					// However, when writing code by hand (e.g. to display on a website) people can forget about this,
					// so we want to be liberal here. We will allow the empty line to be omitted if the first line of
					// the body does not start with a [\w-] character (as headers do).
					/[^ \t\w-][\s\S]*/.source,
					'i'
				),
				lookbehind: true,
				inside: httpLanguages[contentType]
			};
		}
		insertBefore(http, 'header', options);

		return http;
	}
} as LanguageProto<'http'>;
