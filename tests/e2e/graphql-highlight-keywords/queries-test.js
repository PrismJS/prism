const { expect } = require('../../helper/chai');
const prismFactory = require('../../helper/prism-loader');

const Prism = prismFactory.createInstance(['graphql', 'highlight-keywords']);

describe('E2E test - Prism#highlights queries correctly', () => {
	it('query ex. 1', () => {
		expect(subject(`
query getProductById($id: ID!) {
	product(id: $id) {
		title
		handle
		createdAt
	}
}
`)).toMatchSnapshot();
	});

	it('query shorthand ex. 1', () => {
		expect(subject(`
{
	orders(id: 4) {
		edges {
			node {
				# Order fields
				# Query fields
			}
			cursor
		}
		pageInfo {
			hasNextPage
			hasPreviousPage
		}
	}
}
`)).toMatchSnapshot();
	});
});

function subject(text) {
	return Prism.highlight(text, Prism.languages.graphql, 'graphql');
}
