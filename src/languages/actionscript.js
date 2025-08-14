import { insertBefore } from '../util/language-util.js';
import javascript from './javascript.js';

/** @type {import('../types.d.ts').LanguageProto<'actionscript'>} */
export default {
	id: 'actionscript',
	base: javascript,
	grammar ({ base }) {
		const className = /** @type {GrammarToken} */ (base['class-name']);
		className.alias = 'function';

		delete base['doc-comment'];

		// doesn't work with AS because AS is too complex
		delete base['parameter'];
		delete base['literal-property'];

		insertBefore(base, 'string', {
			'xml': {
				pattern:
					/(^|[^.])<\/?\w+(?:\s+[^\s>\/=]+=("|')(?:\\[\s\S]|(?!\2)[^\\])*\2)*\s*\/?>/,
				lookbehind: true,
				inside: 'markup',
			},
		});

		return {
			'keyword':
				/\b(?:as|break|case|catch|class|const|default|delete|do|dynamic|each|else|extends|final|finally|for|function|get|if|implements|import|in|include|instanceof|interface|internal|is|namespace|native|new|null|override|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|use|var|void|while|with)\b/,
			'operator': /\+\+|--|(?:[+\-*\/%^]|&&?|\|\|?|<<?|>>?>?|[!=]=?)=?|[~?@]/,
		};
	},
};

/**
 * @typedef {import('../types.d.ts').GrammarToken} GrammarToken
 */
