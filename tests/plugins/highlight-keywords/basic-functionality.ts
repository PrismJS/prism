import { createTestSuite } from '../../helper/prism-dom-util';


describe('Highlight Keywords', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
		plugins: 'highlight-keywords'
	});

	it('should highlight keywords', ({ util }) => {
		util.assert.highlightElement({
			language: 'javascript',
			code: `import * from ''; const foo;`
		});
	});

});
