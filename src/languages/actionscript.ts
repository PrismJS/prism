import javascript from './javascript';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'actionscript',
	base: javascript,
	grammar (): Grammar {
		return {
			'keyword':
				/\b(?:as|break|case|catch|class|const|default|delete|do|dynamic|each|else|extends|final|finally|for|function|get|if|implements|import|in|include|instanceof|interface|internal|is|namespace|native|new|null|override|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|use|var|void|while|with)\b/,
			'operator': /\+\+|--|(?:[+\-*\/%^]|&&?|\|\|?|<<?|>>?>?|[!=]=?)=?|[~?@]/,
			// doesn't work with AS because AS is too complex
			$delete: ['doc-comment', 'parameter', 'literal-property'],
			$insertBefore: {
				'string': {
					'xml': {
						pattern:
							/(^|[^.])<\/?\w+(?:\s+[^\s>\/=]+=("|')(?:\\[\s\S]|(?!\2)[^\\])*\2)*\s*\/?>/,
						lookbehind: true,
						inside: 'markup',
					},
				},
			},
			$merge: {
				'class-name': { alias: 'function' },
			},
		};
	},
} as LanguageProto<'actionscript'>;
