import markup from './prism-markup.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'xml-doc',
	require: markup,
	grammar({ getLanguage }) {
		/**
		 * If the given language is present, it will insert the given doc comment grammar token into it.
		 *
		 * @param {string} lang
		 * @param {any} docComment
		 */
		function insertDocComment(lang, docComment) {
			if (Prism.languages[lang]) {
				Prism.languages.insertBefore(lang, 'comment', {
					'doc-comment': docComment
				});
			}
		}

		let tag = Prism.languages.markup.tag;

		let slashDocComment = {
			pattern: /\/\/\/.*/,
			greedy: true,
			alias: 'comment',
			inside: {
				'tag': tag
			}
		};
		let tickDocComment = {
			pattern: /'''.*/,
			greedy: true,
			alias: 'comment',
			inside: {
				'tag': tag
			}
		};

		insertDocComment('csharp', slashDocComment);
		insertDocComment('fsharp', slashDocComment);
		insertDocComment('vbnet', tickDocComment);
	}
});
