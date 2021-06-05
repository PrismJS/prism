const { expect } = require('../../helper/chai');
const prismFactory = require('../../helper/prism-loader');

const Prism = prismFactory.createInstance(['graphql', 'highlight-keywords']);

describe('E2E test - Prism#highlights schema def\'ns correctly', () => {
	it('schema def ex. 1', () => {
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

function subject(code, language = 'graphql') {
	return Prism.highlight(code, Prism.languages[language], language);
}
