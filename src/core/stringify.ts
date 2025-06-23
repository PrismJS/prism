import { htmlEncode } from '../shared/util';
import type { HookEnv, Hooks } from './classes/hooks';
import type { Token, TokenStream } from './classes/token';

/**
 * Converts the given token or token stream to an HTML representation.
 *
 * The following hooks will be run:
 * 1. `wrap`: On each {@link Token}.
 *
 * @param o The token or token stream to be converted.
 * @param language The name of current language.
 * @returns The HTML representation of the token or token stream.
 */
function stringify (o: string | Token | TokenStream, language: string, hooks: Hooks): string {
	if (typeof o === 'string') {
		return htmlEncode(o);
	}
	if (Array.isArray(o)) {
		let s = '';
		o.forEach(e => {
			s += stringify(e, language, hooks);
		});
		return s;
	}

	const env: HookEnv = {
		type: o.type,
		content: stringify(o.content, language, hooks),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language,
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

	let attributes = '';
	for (const name in env.attributes) {
		attributes +=
			' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}

	return (
		'<' +
		env.tag +
		' class="' +
		env.classes.join(' ') +
		'"' +
		attributes +
		'>' +
		env.content +
		'</' +
		env.tag +
		'>'
	);
}

export { stringify };
export default stringify;
