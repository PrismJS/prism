const { expect } = require('../helper/chai');
const prismFactory = require('../helper/prism-loader');

const components = ['graphql', 'highlight-keywords'];
const Prism = prismFactory.createInstance(components);

describe(`prism-graphql E2E tests - ${components.join('+')}`, () => {
	require('../languages/graphql/fixtures').forEach((code) => {
		const [title] = code.trim().split('\n');
		it(`#highlights ${title} correctly`, () => {
			expect(Prism.highlight(code, Prism.languages.graphql, 'graphql')).toMatchSnapshot();
		});
	});
});
