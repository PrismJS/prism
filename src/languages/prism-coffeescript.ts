import { insertBefore } from '../shared/language-util';
import javascript from './prism-javascript';
import type { LanguageProto } from '../types';

export default {
	id: 'coffeescript',
	require: javascript,
	alias: 'coffee',
	grammar({ extend }) {
		// Ignore comments starting with { to privilege string interpolation highlighting
		const comment = /#(?!\{).+/;
		const interpolation = {
			pattern: /#\{[^}]+\}/,
			alias: 'variable'
		};

		const coffeescript = extend('javascript', {
			'comment': comment,
			'string': [

				// Strings are multiline
				{
					pattern: /'(?:\\[\s\S]|[^\\'])*'/,
					greedy: true
				},

				{
					// Strings are multiline
					pattern: /"(?:\\[\s\S]|[^\\"])*"/,
					greedy: true,
					inside: {
						'interpolation': interpolation
					}
				}
			],
			'keyword': /\b(?:and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
			'class-member': {
				pattern: /@(?!\d)\w+/,
				alias: 'variable'
			}
		});

		insertBefore(coffeescript, 'comment', {
			'multiline-comment': {
				pattern: /###[\s\S]+?###/,
				alias: 'comment'
			},

			// Block regexp can contain comments and interpolation
			'block-regex': {
				pattern: /\/{3}[\s\S]*?\/{3}/,
				alias: 'regex',
				inside: {
					'comment': comment,
					'interpolation': interpolation
				}
			}
		});

		insertBefore(coffeescript, 'string', {
			'inline-javascript': {
				pattern: /`(?:\\[\s\S]|[^\\`])*`/,
				inside: {
					'delimiter': {
						pattern: /^`|`$/,
						alias: 'punctuation'
					},
					'script': {
						pattern: /[\s\S]+/,
						alias: 'language-javascript',
						inside: 'javascript'
					}
				}
			},

			// Block strings
			'multiline-string': [
				{
					pattern: /'''[\s\S]*?'''/,
					greedy: true,
					alias: 'string'
				},
				{
					pattern: /"""[\s\S]*?"""/,
					greedy: true,
					alias: 'string',
					inside: {
						'interpolation': interpolation
					}
				}
			]

		});

		insertBefore(coffeescript, 'keyword', {
			// Object property
			'property': /(?!\d)\w+(?=\s*:(?!:))/
		});

		delete coffeescript['doc-comment'];
		delete coffeescript['template-string'];

		return coffeescript;
	}
} as LanguageProto<'coffeescript'>;
