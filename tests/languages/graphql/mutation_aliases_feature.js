module.exports = {
	[`
mutation CreateMessage($input: MessageInput!) {
  createMessage(input: $input) {
    id
  }
}
`]: `
<span class="token keyword">mutation</span> <span class="token definition-mutation function">CreateMessage</span><span class="token punctuation">(</span><span class="token variable variable-input">$input</span><span class="token punctuation">:</span> <span class="token class-name atom-input">MessageInput</span><span class="token operator">!</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token property-query property-mutation">createMessage</span><span class="token punctuation">(</span><span class="token attr-name">input</span><span class="token punctuation">:</span> <span class="token variable variable-input">$input</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token property">id</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
`,

	[`
mutation {
  customerCreate(input: { firstName: "John", lastName: "Tate", email: "john@johns-apparel.com" }) {
    customer {
      id
    }
  }
}
`]: `
<span class="token keyword">mutation</span> <span class="token punctuation">{</span>
  <span class="token property-query property-mutation">customerCreate</span><span class="token punctuation">(</span><span class="token attr-name">input</span><span class="token punctuation">:</span> <span class="token punctuation">{</span> <span class="token attr-name">firstName</span><span class="token punctuation">:</span> <span class="token string">"John"</span><span class="token punctuation">,</span> <span class="token attr-name">lastName</span><span class="token punctuation">:</span> <span class="token string">"Tate"</span><span class="token punctuation">,</span> <span class="token attr-name">email</span><span class="token punctuation">:</span> <span class="token string">"john@johns-apparel.com"</span> <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token object">customer</span> <span class="token punctuation">{</span>
      <span class="token property">id</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
`,

	[`
mutation Login($email: String) {
  login(email: $email)
}
`]: `
<span class="token keyword">mutation</span> <span class="token definition-mutation function">Login</span><span class="token punctuation">(</span><span class="token variable variable-input">$email</span><span class="token punctuation">:</span> <span class="token scalar atom-input">String</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token property-query property-mutation">login</span><span class="token punctuation">(</span><span class="token attr-name">email</span><span class="token punctuation">:</span> <span class="token variable variable-input">$email</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
`,

	[`
mutation BookTrip($id:ID!) {
  bookTrips(launchIds: [$id]) {
    success
    message
    launches {
      id
    }
  }
}
`]: `
<span class="token keyword">mutation</span> <span class="token definition-mutation function">BookTrip</span><span class="token punctuation">(</span><span class="token variable variable-input">$id</span><span class="token punctuation">:</span><span class="token scalar atom-input">ID</span><span class="token operator">!</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token property-query property-mutation">bookTrips</span><span class="token punctuation">(</span><span class="token attr-name">launchIds</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token variable variable-input">$id</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token property">success</span>
    <span class="token property">message</span>
    <span class="token object">launches</span> <span class="token punctuation">{</span>
      <span class="token property">id</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
`,
};
