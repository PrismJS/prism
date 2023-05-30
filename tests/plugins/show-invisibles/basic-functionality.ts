import { createTestSuite } from '../../helper/prism-dom-util';


describe('Show Invisibles', () => {
	const { it } = createTestSuite({
		languages: 'javascript',
		plugins: 'show-invisibles'
	});

	it('should show invisible characters', ({ util }) => {
		util.assert.highlightElement({
			language: 'javascript',
			code: `  \t\n\r\n\t\t`,
			format: false
		});
	});

	it('should show invisible characters inside tokens', ({ util }) => {
		util.assert.highlightElement({
			language: 'javascript',
			code: `/* \n */`,
			format: false
		});
	});
});
