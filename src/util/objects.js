import { toArray } from './iterables.js';

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

/**
 *
 * @param {any} obj
 * @param {string} type
 * @returns {boolean}
 */
export function isObject (obj, type) {
	if (!obj || typeof obj !== 'object') {
		return false;
	}

	const proto = Object.getPrototypeOf(obj);
	return proto.constructor?.name === type;
}

/**
 * @param {any} obj
 * @returns {boolean}
 */
export function isPlainObject (obj) {
	return isObject(obj, 'Object');
}

/**
 * @typedef {object} MergeOptions
 * @property {any[]} [emptyValues]
 * @property {string[]} [containers]
 * @property {(value: any, key?: Property, parent?: any) => boolean} [isContainer]
 * @property {boolean} [mergeArrays]
 */

/** @typedef {string | number | symbol} Property */

/**
 *
 * @param {any} target
 * @param {any} source
 * @param {MergeOptions} [options={}]
 * @returns
 */
export function deepMerge (target, source, options = {}) {
	const {
		emptyValues = [undefined],
		containers = ['Object', 'EventTarget'],
		isContainer = value => containers.some(type => isObject(value, type)),
		mergeArrays = false,
	} = options;

	if (mergeArrays && (Array.isArray(target) || Array.isArray(source))) {
		target = toArray(target);
		source = toArray(source);
		return target.concat(source);
	}

	if (isContainer(target) && isContainer(source)) {
		for (const key in source) {
			target[key] = deepMerge(target[key], source[key], options);
		}

		return target;
	}

	if (emptyValues.includes(target)) {
		return source;
	}

	return source ?? target;
}

/**
 * @typedef {object} CloneOptions
 *
 * Used internally to store clones of objects,
 * both for performance but mainly to avoid getting tripped up in circular references
 * @property {WeakMap<any, any>} [_clones]
 */

/**
 * @param {any} obj
 * @param {CloneOptions} options
 */
export function deepClone (obj, options = {}) {
	if (!obj || typeof obj !== 'object') {
		return obj;
	}

	options._clones ??= new WeakMap();
	const { _clones } = options;

	if (_clones.has(obj)) {
		return _clones.get(obj);
	}

	let ret = obj;

	if (Array.isArray(obj)) {
		ret = [];
		_clones.set(obj, ret);

		for (const item of obj) {
			ret.push(deepClone(item, options));
		}
	}
	else if (isPlainObject(obj)) {
		ret = { ...obj };
		_clones.set(obj, ret);

		for (const key in obj) {
			ret[key] = deepClone(obj[key], options);
		}
	}

	return ret;
}

/**
 * Like Object.assign() but preserves accessors.
 *
 * @param {Record<string, any>} target
 * @param {Record<string, any>[]} sources
 */
export function betterAssign (target, ...sources) {
	for (const source of sources) {
		const descriptors = Object.getOwnPropertyDescriptors(source);
		for (const key in descriptors) {
			if (Object.hasOwn(target, key)) {
				continue;
			}

			const descriptor = descriptors[key];
			Object.defineProperty(target, key, descriptor);
		}
	}

	return target;
}
