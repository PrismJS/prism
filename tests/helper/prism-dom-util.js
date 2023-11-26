import { assert } from '@esm-bundle/chai';

/**
	* @param {Prism} Prism
	*/
export function createUtil(Prism) {
	const util = {
		assert: {
			highlight({ language = 'none', code, expected }) {
				assert.strictEqual(Prism.highlight(code, Prism.languages[language], language), expected);
			},
			highlightElement({ language = 'none', code, expected }) {
				const element = document.createElement('CODE');
				element.classList.add('language-' + language);
				element.textContent = code;

				Prism.highlightElement(element);

				assert.strictEqual(element.innerHTML, expected);
			}
		},
	};

	return util;
}