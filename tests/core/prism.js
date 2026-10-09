import { assert } from 'chai';
import Prism from '../../src/core/classes/prism.js';

describe('Prism.isPrism', () => {
	// The IIFE build and an ESM import each have their own copy of the class
	it('should accept an instance of another copy of the class', async () => {
		// The query string makes Node evaluate the module again, as a separate copy
		const url = new URL('../../src/core/classes/prism.js?copy', import.meta.url);
		const { default: OtherPrism } = await import(url.href);

		assert.isTrue(Prism.isPrism(new OtherPrism()));
	});

	// `window.Prism` can also hold page settings
	it('should reject a config object', () => {
		assert.isFalse(Prism.isPrism({ manual: true }));
	});
});
