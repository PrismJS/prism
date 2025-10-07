/**
 * Returns a function that caches the result of the given supplier.
 *
 * @template T
 * @param {() => T} supplier
 * @returns {() => T}
 */
export function lazy (supplier) {
	/** @type {T} */
	let value;
	let hasValue = false;
	return () => {
		if (hasValue) {
			return value;
		}

		value = supplier();
		hasValue = true;
		return value;
	};
}

/**
 * @param {string} text
 * @returns {string}
 */
export function htmlEncode (text) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/\u00a0/g, ' ');
}

/**
 * A function that does nothing.
 *
 * @type {() => void | undefined}
 */
export const noop = () => {
	/* noop */
};

/**
 * @param {any} value
 * @returns {value is T & {}}
 */
export function isNonNull (value) {
	return value != null;
}

/**
 * Escapes all special regex characters in the given string.
 *
 * @param {string} string
 * @returns {string}
 */
export function regexEscape (string) {
	return string.replace(/([\\[\](){}+*?|^$.])/g, '\\$1');
}

/**
 * @param {string} string
 * @returns {string}
 */
export function capitalize (string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts the given kebab case identifier to a camel case identifier.
 *
 * @param {string} kebab
 * @returns {string}
 */
export function kebabToCamelCase (kebab) {
	const [first, ...others] = kebab.split(/-/);
	return first + others.map(capitalize).join('');
}
