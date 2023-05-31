import { createTestSuite } from '../../helper/prism-dom-util';


describe('Custom class', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
		plugins: 'custom-class'
	});

	it('should set prefix', ({ Prism, util }) => {
		Prism.plugins.customClass.prefix = 'prism-';

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});

	it('should reset prefix', ({ Prism, util }) => {
		Prism.plugins.customClass.prefix = '';

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});

	it('should map class names using a function', ({ Prism, util }) => {
		Prism.plugins.customClass.map((cls) => {
			return `${cls}-suffix`;
		});

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});

	it('should map class names using an object', ({ Prism, util }) => {
		Prism.plugins.customClass.map({
			boolean: 'b',
			keyword: 'kw',
			operator: 'op',
			punctuation: 'p'
		});

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});

	it('should reset map', ({ Prism, util }) => {
		Prism.plugins.customClass.map({});

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});

});
