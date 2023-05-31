import { createTestSuite } from '../../helper/prism-dom-util';


describe('Data-URI Highlight', () => {
	const { it } = createTestSuite({
		languages: ['css', 'markup'],
		plugins: 'data-uri-highlight'
	});

	it('should set prefix', ({ util }) => {
		util.assert.highlight({
			language: 'css',
			code: String.raw`
div {
    border: 40px solid transparent;
    border-image: 33.334% url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"> \
                          <circle cx="5" cy="5" r="5" fill="%23ab4"/><circle cx="15" cy="5" r="5" fill="%23655"/> \
                          <circle cx="25" cy="5" r="5" fill="%23e07"/><circle cx="5" cy="15" r="5" fill="%23655"/> \
                          <circle cx="15" cy="15" r="5" fill="hsl(15, 25%, 75%)"/> \
                          <circle cx="25" cy="15" r="5" fill="%23655"/><circle cx="5" cy="25" r="5" fill="%23fb3"/> \
                          <circle cx="15" cy="25" r="5" fill="%23655"/><circle cx="25" cy="25" r="5" fill="%2358a"/></svg>');
    padding: 1em;
    max-width: 20em;
    font: 130%/1.6 Baskerville, Palatino, serif;
}
`,
		});
	});
});
