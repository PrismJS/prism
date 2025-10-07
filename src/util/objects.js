/**
 * @template {Record<string, any>} T
 * @template {keyof T} K
 * @param {T} obj
 * @param {K} key
 * @param {() => T[K]} getter
 * @param {any} [waitFor]
 * @returns {Promise<void>}
 */
export async function defineLazyProperty (obj, key, getter, waitFor) {
	if (waitFor) {
		await waitFor;
	}

	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get () {
			const value = getter.call(this);
			// Replace the getter with a writable property
			defineSimpleProperty(this, key, value);
			return value;
		},
		set (value) {
			defineSimpleProperty(this, key, value);
		},
	});
}

/**
 * @template {Record<string, any>} T
 * @template {keyof T} K
 * @param {T} obj
 * @param {K} key
 * @param {T[K]} value
 * @returns {void}
 */
export function defineSimpleProperty (obj, key, value) {
	Object.defineProperty(obj, key, {
		value,
		writable: true,
		enumerable: true,
		configurable: false,
	});
}
