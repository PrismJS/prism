/**
 * Converts the given value to an array.
 *
 * If the given value is already an error, it will be returned as is.
 *
 * @template {{}} T
 * @param {T | T[] | undefined | null} value
 * @returns {T[]}
 */
export function toArray (value) {
	if (Array.isArray(value)) {
		return value;
	}
	else if (value == null) {
		return [];
	}
	else {
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
 * @template {{}} T
 * @param {T | T[] | null | undefined} value
 * @param {(value: T, index: number) => void} callbackFn
 * @returns {void}
 */
export function forEach (value, callbackFn) {
	if (Array.isArray(value)) {
		value.forEach(callbackFn);
	}
	else if (value != null) {
		callbackFn(value, 0);
	}
}
