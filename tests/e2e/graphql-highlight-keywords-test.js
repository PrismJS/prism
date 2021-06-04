const { expect } = require('../helper/chai');
const prismFactory = require('../helper/prism-loader');

const Prism = prismFactory.createInstance(['graphql', 'highlight-keywords']);

describe('graphql + highlight keywords > Prism#highlight is correct', () => {
	it('schema definition ex. 1', () => {
		expect(subject(`
type Human implements Character {
	id: ID!
	name: String!
	friends: [Character]
	appearsIn: [Episode]!
	starships: [Starship]
	totalCredits: Int
}
type Droid implements Character {
	id: ID!
	name: String!
	friends: [Character]
	appearsIn: [Episode]!
	primaryFunction: String
}`)).toMatchSnapshot();
	});

	it('mutation ex. 1', () => {
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

	it('Input Type definition ex. 1', () => {
		expect(subject(`
input OrderInput {
	id: ID!
	customAttributes: [AttributeInput!]
	customer: Customer
	localizationExtensions: [LocalizationExtensionInput!]
	metafields: [MetafieldInput!]
	note: String!
	shippingAddress: MailingAddressInput
	tags: [String!]
}
		`)).toMatchSnapshot();
	});
});

function subject(text) {
	return Prism.highlight(text, Prism.languages.graphql, 'graphql');
}
