import markup from './prism-markup.js';
import { Token } from '../core/token';
import { regexEscape } from '../shared/util';
import { combineCallbacks } from '../shared/hooks-util.js';

/**
 * Returns a regex of all possible placeholders.
 *
 * @param {string} language
 * @returns {RegExp}
 */
function getPlaceholderPattern(language) {
	return RegExp(`___${regexEscape(language)}\\d+___`);
}

/**
 * Returns the placeholder for the given language id and index.
 *
 * @param {string} language
 * @param {string|number} index
 * @returns {string}
 */
function getPlaceholder(language, index) {
	return '___' + language.toUpperCase() + index + '___';
}


export class MarkupTemplating {
	/**
	 * @param {string} language The language id.
	 * @param {import('../core/prism').Prism} Prism
	 */
	// eslint-disable-next-line no-unused-vars
	constructor(language, Prism) {
		this.language = language;
		this.Prism = Prism;
	}

	/**
	 * Tokenize all inline templating expressions matching `placeholderPattern`.
	 *
	 * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
	 * `true` will be replaced.
	 *
	 * @param {import('../core/hooks-env').HookEnvMap["before-tokenize"]} env The environment of the `before-tokenize` hook.
	 * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
	 * @param {(match: string) => boolean} [replaceFilter]
	 */
	buildPlaceholders(env, placeholderPattern, replaceFilter) {
		if (env.language !== this.language) {
			return;
		}

		const tokenStack = env.tokenStack = [];

		const hasPlaceholderLike = getPlaceholderPattern(this.language).test(env.code);

		env.code = env.code.replace(placeholderPattern, (match) => {
			if (typeof replaceFilter === 'function' && !replaceFilter(match)) {
				return match;
			}
			let i = tokenStack.length;

			// Check for existing strings
			if (hasPlaceholderLike) {
				while (env.code.indexOf(getPlaceholder(this.language, i)) !== -1) {
					++i;
				}
			}

			// Create a sparse array
			tokenStack[i] = match;

			return getPlaceholder(this.language, i);
		});

		// Switch the grammar to markup
		env.grammar = this.Prism.components.getLanguage('markup');
	}

	/**
	 * Replace placeholders with proper tokens after tokenizing.
	 *
	 * @param {import('../core/hooks-env').HookEnvMap["after-tokenize"]} env The environment of the `after-tokenize` hook.
	 */
	tokenizePlaceholders(env) {
		if (env.language !== this.language || !env.tokenStack) {
			return;
		}

		// Switch the grammar back
		env.grammar = this.Prism.components.getLanguage(this.language);

		let j = 0;
		const keys = Object.keys(env.tokenStack);

		/**
		 * @param {import("../core/token").TokenStream} tokens
		 * @returns
		 */
		const walkTokens = (tokens) => {
			for (let i = 0; i < tokens.length; i++) {
				// all placeholders are replaced already
				if (j >= keys.length) {
					break;
				}

				const token = tokens[i];
				if (typeof token === 'string' || typeof token.content === 'string') {
					const k = keys[j];
					const t = env.tokenStack[k];
					const s = typeof token === 'string' ? token : /** @type {string} */(token.content);
					const placeholder = getPlaceholder(this.language, k);

					const index = s.indexOf(placeholder);
					if (index > -1) {
						++j;

						const before = s.substring(0, index);
						const middle = new Token(this.language, this.Prism.tokenize(t, env.grammar), 'language-' + this.language, t);
						const after = s.substring(index + placeholder.length);

						const replacement = [];
						if (before) {
							replacement.push(...walkTokens([before]));
						}
						replacement.push(middle);
						if (after) {
							replacement.push(...walkTokens([after]));
						}

						if (typeof token === 'string') {
							tokens.splice(i, 1, ...replacement);
						} else {
							token.content = replacement;
						}
					}
				} else {
					walkTokens(token.content);
				}
			}

			return tokens;
		};

		walkTokens(env.tokens);
	}

	/**
	 *
	 * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
	 */
	addHooks(placeholderPattern) {
		const hook1 = this.Prism.hooks.add('before-tokenize', (env) => {
			this.buildPlaceholders(env, placeholderPattern);
		});

		const hook2 = this.Prism.hooks.add('after-tokenize', (env) => {
			this.tokenizePlaceholders(env);
		});

		return combineCallbacks(hook1, hook2);
	}
}

export default /** @type {import("../types").LanguageProto<'markup-templating'>} */ ({
	id: 'markup-templating',
	require: markup,
	grammar: {}
});
