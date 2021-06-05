const { expect } = require('../../helper/chai');
const prismFactory = require('../../helper/prism-loader');

const Prism = prismFactory.createInstance(['graphql', 'highlight-keywords']);

describe('E2E test - Prism#highlights mutations correctly', () => {
	it('ex. 1', () => {
		expect(subject(`
mutation orderUpdate($input: OrderInput!) {
	orderUpdate(input: $input) {
		order {
			# Order fields
		}
		userErrors {
			field
			message
		}
	}
}
`)).toMatchSnapshot();
	});
});

function subject(text) {
	return Prism.highlight(text, Prism.languages.graphql, 'graphql');
}
