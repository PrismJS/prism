module.exports = [`
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
}`, `
input OrderInput {
	id: ID!
	customAttributes: [AttributeInput!]
	customer: Customer
	localizationExtensions: [LocalizationExtensionInput!]
	metafields: [MetafieldInput!]
	note: String!
	shippingAddress: MailingAddressInput
	tags: [String!]
}`, `
query getProductById($id: ID!) {
	product(id: $id) {
		title
		handle
		createdAt
	}
}`, `
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
}`, `
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
`, `
mutation {
	customerCreate(input: { firstName: "John", lastName: "Tate", email: "john@johns-apparel.com" }) {
		customer {
			id
		}
	}
}
`, `
mutation Login($email: String) {
	login(email: $email)
}
`, `
mutation BookTrip($id:ID!) {
	bookTrips(launchIds: [$id]) {
		success
		message
		launches {
			id
		}
	}
}
`
];
