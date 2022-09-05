/**
 * Returns a function that caches the result of the given supplier.
 *
 * @param {() => T} supplier
 * @returns {() => T}
 * @template T
 */
export function lazy(supplier) {
	let value = /** @type {T} */ (/** @type {unknown} */ (undefined));
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
export function htmlEncode(text) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
}

/**
 * A function that does nothing.
 *
 * @returns {void & undefined}
 */
export function noop() {
	/* do nothing */
}

/**
 * @param {T} value
 * @returns {value is T & {}}
 * @template T
 */
export function isNonNull(value) {
	return value != null;
}

/**
 * Escapes all special regex characters in the given string.
 *
 * @param {string} string
 * @returns {string}
 */
export function regexEscape(string) {
	return string.replace(/([\\[\](){}+*?|^$.])/g, '\\$1');
}

/**
 * @type {(arg: unknown) => arg is readonly any[]}
 */
const isReadonlyArray = Array.isArray;

/**
 * Converts the given value to an array.
 *
 * If the given value is already an error, it will be returned as is.
 *
 * @param {T | readonly T[] | undefined | null} value
 * @returns {readonly T[]}
 * @template {{}} T
 */
export function toArray(value) {
	if (isReadonlyArray(value)) {
		return value;
	} else if (value == null) {
		return [];
	} else {
		return [value];
	}
}


/**
 * Invokes the given callback for all elements of the given value.
 *
 * If the given value is an array, the callback will be invokes for all elements. If the given value is `null` or
 * `undefined`, the callback will not be invoked. In all other cases, the callback will be invoked with the given
 * value as parameter.
 *
 * @param {null | undefined | T | readonly T[]} value
 * @param {(value: T, index: number) => void} callbackFn
 * @returns {void}
 * @template {{}} T
 */
export function forEach(value, callbackFn) {
	if (Array.isArray(value)) {
		value.forEach(callbackFn);
	} else if (value != null) {
		callbackFn(/** @type {T} */(value), 0);
	}
}

/**
 * @param {T} string
 * @returns {Capitalize<T>}
 * @template {string} T
 */
export function capitalize(string) {
	// This is the internal implementation of `Capitalize<T>` by TS.
	// https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#capitalizestringtype
	return /** @type {Capitalize<T>} */ (string.charAt(0).toUpperCase() + string.slice(1));
}

/**
 * Converts the given kebab case identifier to a camel case identifier.
 *
 * @param {T} kebab
 * @returns {import('../types').KebabToCamelCase<T>}
 * @template {string} T
 */
export function kebabToCamelCase(kebab) {
	const [first, ...others] = kebab.split(/-/);
	return /** @type {import('../types').KebabToCamelCase<T>} */(first + others.map(capitalize).join(''));
}
