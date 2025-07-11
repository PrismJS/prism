import singleton from './prism';
import { stringify } from './stringify';
import { tokenize } from './tokenize/tokenize';
import type { HookEnv } from './classes/hooks';
import type { LanguageLike, LanguageProto } from './classes/language';
import type { Token, TokenStream } from './classes/token';
import type { Prism } from './prism';

declare module './classes/hooks' {
	interface HookEnv {
		'before-tokenize': {
			code: string;
			languageId?: string;
			languageDef?: LanguageProto<string>;
			language?: any;
			languageReady?: Promise<any>;
		};
		'after-tokenize': HookEnv['before-tokenize'] & { tokens?: TokenStream };
	}
}

/**
 * Low-level function, only use if you know what you're doing. It accepts a string of text as input
 * and the language definitions to use, and returns a string with the HTML produced.
 *
 * The following hooks will be run:
 * 1. `before-tokenize`
 * 2. `after-tokenize`
 * 3. `wrap`: On each {@link Token}.
 *
 * @param text A string with the code to be highlighted.
 * @param language The name of the language definition passed to `grammar`.
 * @param options An object containing the tokens to use.
 *
 * Usually a language definition like `Prism.languages.markup`.
 * @returns The highlighted HTML.
 * @example
 * Prism.highlight('var foo = true;', 'javascript');
 */
export function highlight (
	this: Prism,
	text: string,
	languageRef: string | LanguageLike,
	options: HighlightOptions = {}
): string {
	const prism = this ?? singleton;

	const { id, def, language } = prism.languageRegistry.resolveRef(languageRef);

	let env: HookEnv['after-tokenize'] = {
		code: text,
		languageId: id,
		languageDef: def,
		language,
	};

	if (env.languageDef && !env.language) {
		env.language = prism.languageRegistry.getLanguage(env.languageDef);
	}

	prism.hooks.run('before-tokenize', env);

	if (!env.language) {
		throw new Error(`No language definition found for ${env.languageId}.`);
	}

	env.tokens = tokenize.call(prism, env.code, env.language!.resolvedGrammar);
	prism.hooks.run('after-tokenize', env);

	return stringify(env.tokens, env.language, prism.hooks);
}

export interface HighlightOptions {}
