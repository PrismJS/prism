
const isReadonlyArray: (arg: unknown) => arg is readonly any[] = Array.isArray;

/**
 * Converts the given value to an array.
 *
 * If the given value is already an error, it will be returned as is.
 */
export function toArray<T extends {}> (value: T | readonly T[] | undefined | null): readonly T[] {
	if (isReadonlyArray(value)) {
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
 */
export function forEach<T extends {}> (
	value: null | undefined | T | readonly T[],
	callbackFn: (value: T, index: number) => void
): void {
	if (Array.isArray(value)) {
		value.forEach(callbackFn);
	}
	else if (value != null) {
		callbackFn(value as T, 0);
	}
}

export function isIterable (value: any): value is Iterable<any> {
	return typeof value === 'object' && Symbol.iterator in Object(value);
}

export function toIterable<T> (value: any): Iterable<T> {
	if (isIterable(value)) {
		return value;
	}

	return toArray(value);
}
