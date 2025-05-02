import { toArray } from './iterables';

export async function defineLazyProperty<T extends object, K extends keyof T> (
	obj: T,
	key: K,
	getter: () => T[K],
	waitFor?: any
) {
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

export function defineSimpleProperty<T extends object, K extends keyof T> (
	obj: T,
	key: K,
	value: T[K]
): void {
	Object.defineProperty(obj, key, {
		value,
		writable: true,
		enumerable: true,
		configurable: false,
	});
}

type Property = string | number | symbol;
type EachCallback = (value: any, key: Property, parent: any, path: Property[]) => void;

export function isPlainObject (obj: unknown) {
	return isObject(obj, 'Object');
}

export function isObject (obj: unknown, type: string) {
	if (!obj || typeof obj !== 'object') {
		return false;
	}

	let proto = Object.getPrototypeOf(obj);
	return proto.constructor?.name === type;
}

export interface MergeOptions {
	emptyValues?: any[];
	containers?: string[];
	isContainer?: (value: any, key?: Property, parent?: any) => boolean;
	mergeArrays?: boolean;
}

export function deepMerge (target: any, source: any, options: MergeOptions = {}) {
	let {
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
		for (let key in source) {
			target[key] = deepMerge(target[key], source[key], options);
		}

		return target;
	}

	if (emptyValues.includes(target)) {
		return source;
	}

	return target ?? source;
}

export interface CloneOptions {
	/*
	 * Used internally to store clones of objects,
	 * both for performance but mainly to avoid getting tripped up in circular references
	 */
	_clones?: WeakMap<any, any>;
}

export function deepClone (obj: any, options: CloneOptions = {}) {
	if (!obj || typeof obj !== 'object') {
		return obj;
	}

	options._clones ??= new WeakMap();
	let { _clones } = options;

	if (_clones.has(obj)) {
		return _clones.get(obj);
	}

	let ret = obj;

	if (Array.isArray(obj)) {
		ret = obj.map(item => deepClone(item, options));
	}
	else if (isPlainObject(obj)) {
		ret = { ...obj };

		for (let key in obj) {
			ret[key] = deepClone(obj[key], options);
		}
	}

	_clones.set(obj, ret);
	return ret;
}
