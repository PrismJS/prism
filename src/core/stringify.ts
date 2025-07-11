import { htmlEncode } from '../shared/util';
import type { HookEnv, Hooks } from './classes/hooks';
import type { Token, TokenName, TokenStream } from './classes/token';

declare module './classes/hooks' {
	interface HookEnv {
		'wrap': {
			type: TokenName;
			languageId: string;
			content: string;
			tag: string;
			classes: string[];
			attributes: Record<string, string>;
		};
	}
}

/**
 * Converts the given token or token stream to an HTML representation.
 *
 * The following hooks will be run:
 * 1. `wrap`: On each {@link Token}.
 *
 * @param o The token or token stream to be converted.
 * @param languageId The name of current language.
 * @returns The HTML representation of the token or token stream.
 */
function stringify (o: string | Token | TokenStream, languageId: string, hooks: Hooks): string {
	if (typeof o === 'string') {
		return htmlEncode(o);
	}

	if (Array.isArray(o)) {
		let s = '';
		o.forEach(e => {
			s += stringify(e, languageId, hooks);
		});
		return s;
	}

	const env: HookEnv['wrap'] = {
		type: o.type,
		content: stringify(o.content, languageId, hooks),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		languageId,
	};

	const aliases = o.alias;
	if (aliases) {
		if (Array.isArray(aliases)) {
			env.classes.push(...aliases);
		}
		else {
			env.classes.push(aliases);
		}
	}

	hooks.run('wrap', env);

	const attributes =
		Object.entries(env.attributes)
			.map(([name, value]) => ` ${name}=${(value ?? '').replace(/"/g, '&quot;')}"`)
			.join('') || '';

	return `<${env.tag} class="${env.classes.join(' ')}"${attributes}>${env.content}</${env.tag}>`;
}

export { stringify };
export default stringify;
