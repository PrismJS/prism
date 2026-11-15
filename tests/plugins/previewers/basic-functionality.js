import { createTestSuite } from '../../helper/prism-dom-util.js';

describe('Previewers', () => {
	const { it } = createTestSuite({
		languages: ['css', 'sass', 'stylus', 'markup'],
		plugins: 'previewers',
	});

	it('should add previewer tokens in CSS', ({ util }) => {
		util.assert.highlightElement({
			language: 'css',
			code: `a {
	background: linear-gradient(90deg, red, blue);
	transform: rotate(45deg);
	transition: color 0.5s ease-in-out;
}`,
		});
	});

	it('should add previewer tokens in Sass', ({ util }) => {
		util.assert.highlightElement({
			language: 'sass',
			code: `$angle: 30deg
a
  transition: 2s ease-in`,
		});
	});

	it('should add previewer tokens in Stylus', ({ util }) => {
		util.assert.highlightElement({
			language: 'stylus',
			code: `a
  transform rotate(45deg)
  transition 2s ease`,
		});
	});

	it('should add previewer tokens in markup attributes', ({ util }) => {
		util.assert.highlightElement({
			language: 'markup',
			code: `<div data-angle="45deg" data-time="2s"></div>`,
		});
	});

	it('should add previewer tokens in markup after an html block', ({ util }) => {
		util.assert.highlight({ language: 'html', code: 'a' });
		util.assert.highlightElement({
			language: 'markup',
			code: `<div data-angle="45deg"></div>`,
		});
	});
});

describe('Previewers without CSS', () => {
	const { it } = createTestSuite({
		languages: ['stylus'],
		plugins: 'previewers',
	});

	it('should add previewer tokens in Stylus', ({ util }) => {
		util.assert.highlightElement({
			language: 'stylus',
			code: `a
  color #fff
  transition 1s`,
		});
	});
});
