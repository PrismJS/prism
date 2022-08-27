/**
 * Returns the name of the type of the given value.
 *
 * @param {unknown} obj
 * @returns {string}
 * @example
 * type(null)      === 'Null'
 * type(undefined) === 'Undefined'
 * type(123)       === 'Number'
 * type('foo')     === 'String'
 * type(true)      === 'Boolean'
 * type([1, 2])    === 'Array'
 * type({})        === 'Object'
 * type(String)    === 'Function'
 * type(/abc+/)    === 'RegExp'
 */
function getType(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * @param {any} obj
 * @returns {obj is import("../types").PlainObject}
 */
function isPlainObject(obj) {
	return getType(obj) === 'Object';
}

/**
 * @param {Record<string | number, any>} obj
 * @param {(this: any, key: string, value: any, type: string) => void} callback
 * @param {string | null} [type]
 * @param {Set<unknown>} [visited]
 */
export function DFS(obj, callback, type, visited = new Set()) {
	for (const i in obj) {
		if (obj.hasOwnProperty(i)) {
			callback.call(obj, i, obj[i], type || i);

			const property = obj[i];
			if (!visited.has(property)) {
				if (isPlainObject(property)) {
					visited.add(property);
					DFS(property, callback, null, visited);
				} else if (Array.isArray(property)) {
					visited.add(property);
					DFS(property, callback, i, visited);
				}
			}
		}
	}
}

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
 * Creates a deep clone of the given object.
 *
 * The main intended use of this function is to clone language definitions.
 *
 * @param {T} o
 * @param {Map<any, any>} [mapping]
 * @returns {T}
 * @template T
 */
export function deepClone(o, mapping = new Map()) {
	const mapped = mapping.get(o);
	if (mapped) {
		return mapped;
	}

	if (isPlainObject(o)) {
		/** @type {Record<string, unknown>} */
		const clone = {};
		mapped.set(o, clone);

		for (const key in o) {
			if (o.hasOwnProperty(key)) {
				clone[key] = deepClone(o[key], mapping);
			}
		}

		return /** @type {any} */ (clone);
	} else if (Array.isArray(o)) {
		/** @type {unknown[]} */
		const clone = [];
		mapped.set(o, clone);

		o.forEach((v, i) => {
			clone[i] = deepClone(v, mapping);
		});

		return /** @type {any} */ (clone);
	} else {
		return o;
	}
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
 * Converts the given value to an array.
 *
 * If the given value is already an error, it will be returned as is.
 *
 * @param {T | T[] | undefined | null} value
 * @returns {T[]}
 * @template {{}} T
 */
export function toArray(value) {
	if (Array.isArray(value)) {
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
