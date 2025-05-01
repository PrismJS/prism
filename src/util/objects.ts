export function defineLazyProperty<T, K extends string | number | symbol>(
	obj: T,
	key: K,
	getter: () => T[K],
): void {
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get() {
			const value = getter.call(this);
			// Replace the getter with a writable property
			defineSimpleProperty(this, key, value);
			return value;
		},
		set(value) {
			defineSimpleProperty(this, key, value);
		},
	});
}

export function defineSimpleProperty<T, K extends string | number | symbol>(
	obj: T,
	key: K,
	value: T[K],
): void {
	Object.defineProperty(obj, key, {
		value,
		writable: true,
		enumerable: true,
		configurable: false,
	});
}
