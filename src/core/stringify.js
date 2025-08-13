import { htmlEncode } from '../shared/util.js';

/**
 * Converts the given token or token stream to an HTML representation.
 *
 * The following hooks will be run:
 * 1. `wrap`: On each {@link Token}.
 *
 * @param {string | Token | TokenStream} o The token or token stream to be converted.
 * @param {string} language The name of current language.
 * @param {Hooks} hooks
 * @returns {string} The HTML representation of the token or token stream.
 */
function stringify (o, language, hooks) {
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

	/** @type {HookEnv} */
	const env = {
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

/**
 * @typedef {import('../types.d.ts').HookEnv} HookEnv
 * @typedef {import('./classes/hooks.js').Hooks} Hooks
 * @typedef {import('./classes/token.js').Token} Token
 * @typedef {import('../types.d.ts').TokenStream} TokenStream
 */
