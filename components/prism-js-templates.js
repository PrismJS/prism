(function (Prism) {

	/** @type {Array} */
	var templates = Prism.languages.javascript['template-string'];
	var createTemplate = templates.createTemplate;

	templates.unshift(
		// styled-jsx:
		//   css`a { color: #25F; }`
		// styled-components:
		//   styled.h1`color: red;`
		createTemplate('css', /\b(?:styled(?:\([^)]*\))?(?:\s*\.\s*\w+(?:\([^)]*\))*)*|css(?:\s*\.\s*(?:global|resolve))?|createGlobalStyle|keyframes)/.source, 'css'),

		// html`<p></p>`
		// div.innerHTML = `<p></p>`
		createTemplate('html', /\bhtml|\.\s*(?:inner|outer)HTML\s*=/.source, 'markup'),

		// md`# h1`, markdown`## h2`
		createTemplate('markdown', /\b(?:md|markdown)/.source, 'markdown'),

		// gql`...`, graphql`...`, graphql.experimental`...`
		createTemplate('graphql', /\b(?:gql|graphql(?:\s*\.\s*experimental)?)/.source, 'graphql')
	);

}(Prism));
