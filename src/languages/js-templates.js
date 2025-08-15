import { JS_TEMPLATE, JS_TEMPLATE_INTERPOLATION } from '../shared/languages/patterns.js';
import { embeddedIn } from '../shared/languages/templating.js';

/**
 * Creates a new pattern to match a template string with a special tag.
 *
 * This will return `undefined` if there is no grammar with the given language id.
 *
 * @param {string} language The language id of the embedded language. E.g. `markdown`.
 * @param {string} tag The regex pattern to match the tag.
 * @returns {GrammarToken}
 * @example
 * createTemplate('css', /\bcss/.source);
 */
function createTemplate (language, tag) {
	return {
		pattern: RegExp('((?:' + tag + ')\\s*)' + JS_TEMPLATE.source),
		lookbehind: true,
		greedy: true,
		alias: 'template-string',
		inside: /** @type {Grammar} */ ({
			'template-punctuation': {
				pattern: /^`|`$/,
				alias: 'string',
			},
			[language]: {
				pattern: /[\s\S]+/,
				inside: {
					'interpolation': {
						pattern: RegExp(
							/((?:^|[^\\])(?:\\{2})*)/.source + JS_TEMPLATE_INTERPOLATION.source
						),
						lookbehind: true,
						inside: {
							'interpolation-punctuation': {
								pattern: /^\$\{|\}$/,
								alias: 'punctuation',
							},
							$rest: 'javascript',
						},
					},
					$tokenize: embeddedIn(language),
				},
			},
		}),
	};
}

/** @type {import('../types.d.ts').LanguageProto<'js-templates'>} */
export default {
	id: 'js-templates',
	grammar () {
		return {
			'template-string': [
				// styled-jsx:
				//   css`a { color: #25F; }`
				// styled-components:
				//   styled.h1`color: red;`
				createTemplate(
					'css',
					/\b(?:styled(?:\([^)]*\))?(?:\s*\.\s*\w+(?:\([^)]*\))*)*|css(?:\s*\.\s*(?:global|resolve))?|createGlobalStyle|keyframes)/
						.source
				),

				// html`<p></p>`
				// div.innerHTML = `<p></p>`
				createTemplate('html', /\bhtml|\.\s*(?:inner|outer)HTML\s*\+?=/.source),

				// svg`<path fill="#fff" d="M55.37 ..."/>`
				createTemplate('svg', /\bsvg/.source),

				// md`# h1`, markdown`## h2`
				createTemplate('markdown', /\b(?:markdown|md)/.source),

				// gql`...`, graphql`...`, graphql.experimental`...`
				createTemplate('graphql', /\b(?:gql|graphql(?:\s*\.\s*experimental)?)/.source),

				// sql`...`
				createTemplate('sql', /\bsql/.source),
			],
		};
	},
};

/**
 * @typedef {import('../types.d.ts').Grammar} Grammar
 * @typedef {import('../types.d.ts').GrammarToken} GrammarToken
 */
