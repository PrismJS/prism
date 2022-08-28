import { htmlEncode } from '../../shared/util.js';
import diff, { PREFIXES } from '../../languages/prism-diff.js';
import { addHooks } from '../../shared/hooks-util.js';
import { Token } from '../../core/token.js';

export default /** @type {import("../../types").PluginProto<'diff-highlight'>} */ ({
	id: 'diff-highlight',
	require: diff,
	effect(Prism) {
		const LANGUAGE_REGEX = /^diff-([\w-]+)/i;
		const HTML_TAG = /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/g;
		//this will match a line plus the line break while ignoring the line breaks HTML tags may contain.
		const HTML_LINE = RegExp(/(?:__|[^\r\n<])*(?:\r\n?|\n|(?:__|[^\r\n<])(?![^\r\n]))/.source.replace(/__/g, () => HTML_TAG.source), 'gi');

		/**
		 * @param {import('../../core/hooks-env.js').BeforeSanityCheckEnv | import('../../core/hooks-env.js').BeforeTokenizeEnv} env
		 */
		const setMissingGrammar = (env) => {
			const lang = env.language;
			if (LANGUAGE_REGEX.test(lang) && !env.grammar) {
				env.grammar = Prism.components.getLanguage('diff');
			}
		};

		return addHooks(Prism.hooks, {
			'before-sanity-check': setMissingGrammar,
			'before-tokenize': setMissingGrammar,
			'wrap': (env) => {
				let diffLanguage;

				if (env.language !== 'diff') {
					const langMatch = LANGUAGE_REGEX.exec(env.language);
					if (!langMatch) {
						return; // not a language specific diff
					}

					diffLanguage = langMatch[1];
				}


				// one of the diff tokens without any nested tokens
				if (env.type in PREFIXES) {
					/** @type {string} */
					const content = env.content.replace(HTML_TAG, ''); // remove all HTML tags

					/** @type {string} */
					const decoded = content.replace(/&lt;/g, '<').replace(/&amp;/g, '&');

					// remove any one-character prefix
					const code = decoded.replace(/(^|[\r\n])./g, '$1');

					// highlight, if possible
					let highlighted;
					if (diffLanguage) {
						highlighted = Prism.highlight(code, diffLanguage);
					} else {
						highlighted = htmlEncode(code);
					}

					// get the HTML source of the prefix token
					const prefixToken = new Token(
						'prefix',
						PREFIXES[/** @type {keyof PREFIXES} */(env.type)],
						/\w+/.exec(env.type)?.[0]
					);
					const prefix = Prism.Token.stringify(prefixToken, env.language);

					// add prefix
					const lines = []; let m;
					HTML_LINE.lastIndex = 0;
					while ((m = HTML_LINE.exec(highlighted))) {
						lines.push(prefix + m[0]);
					}
					if (/(?:^|[\r\n]).$/.test(decoded)) {
					// because both "+a\n+" and "+a\n" will map to "a\n" after the line prefixes are removed
						lines.push(prefix);
					}
					env.content = lines.join('');

					if (diffLanguage) {
						env.classes.push('language-' + diffLanguage);
					}
				}
			}
		});
	}
});
