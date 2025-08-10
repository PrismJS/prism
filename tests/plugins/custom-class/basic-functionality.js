import { createTestSuite } from '../../helper/prism-dom-util.js';

describe('Custom class', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
		plugins: 'custom-class',
	});

	it('should set prefix', ({ Prism, util }) => {
		/** @type {CustomClass} */
		const customClass = Prism.plugins.customClass;
		customClass.prefix = 'prism-';

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});

	it('should reset prefix', ({ Prism, util }) => {
		/** @type {CustomClass} */
		const customClass = Prism.plugins.customClass;
		customClass.prefix = '';

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});

	it('should map class names using a function', ({ Prism, util }) => {
		/** @type {CustomClass} */
		const customClass = Prism.plugins.customClass;
		customClass.map(cls => {
			return `${cls}-suffix`;
		});

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});

	it('should map class names using an object', ({ Prism, util }) => {
		/** @type {CustomClass} */
		const customClass = Prism.plugins.customClass;
		customClass.map({
			boolean: 'b',
			keyword: 'kw',
			operator: 'op',
			punctuation: 'p',
		});

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});

	it('should reset map', ({ Prism, util }) => {
		/** @type {CustomClass} */
		const customClass = Prism.plugins.customClass;
		customClass.map({});

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});
});

/**
 * @typedef {import('../../../src/plugins/custom-class/prism-custom-class').CustomClass} CustomClass
 */
