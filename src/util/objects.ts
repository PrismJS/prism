import { toArray } from './iterables';

export function defineLazyProperty<T extends object, K extends keyof T> (
	obj: T,
	key: K,
	getter: () => T[K]
): void {
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
	clones?: WeakMap<any, any>;
}

export function deepClone (obj: any, options: CloneOptions = {}) {
	if (!obj) {
		return obj;
	}

	// Clones helps us not get tripped up in circular references
	// and also helps us not create multiple copies of the same object
	// when cloning a single object multiple times
	options.clones ??= new WeakMap();
	let { clones } = options;

	if (clones.has(obj)) {
		return clones.get(obj);
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

	clones.set(obj, ret);
	return ret;
}
