import { createTestSuite } from '../../helper/prism-dom-util';
import type { CustomClass } from '../../../src/plugins/custom-class/prism-custom-class';

describe('Custom class', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
		plugins: 'custom-class',
	});

	it('should set prefix', ({ Prism, util }) => {
		const customClass = Prism.plugins.customClass as CustomClass;
		customClass.prefix = 'prism-';

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});

	it('should reset prefix', ({ Prism, util }) => {
		const customClass = Prism.plugins.customClass as CustomClass;
		customClass.prefix = '';

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});

	it('should map class names using a function', ({ Prism, util }) => {
		const customClass = Prism.plugins.customClass as CustomClass;
		customClass.map(cls => {
			return `${cls}-suffix`;
		});

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});

	it('should map class names using an object', ({ Prism, util }) => {
		const customClass = Prism.plugins.customClass as CustomClass;
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
		const customClass = Prism.plugins.customClass as CustomClass;
		customClass.map({});

		util.assert.highlight({
			language: 'javascript',
			code: `var a = true;`,
		});
	});
});
