import type { KebabToCamelCase } from '../types';

/**
 * Returns a function that caches the result of the given supplier.
 */
export function lazy<T>(supplier: () => T): () => T {
	let value: T;
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

export function htmlEncode(text: string): string {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
}

/**
 * A function that does nothing.
 */
export const noop = (() => { /* noop */ }) as () => (void & undefined);

export function isNonNull<T>(value: T): value is T & {} {
	return value != null;
}

/**
 * Escapes all special regex characters in the given string.
 */
export function regexEscape(string: string): string {
	return string.replace(/([\\[\](){}+*?|^$.])/g, '\\$1');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isReadonlyArray: (arg: unknown) => arg is readonly any[] = Array.isArray;

/**
 * Converts the given value to an array.
 *
 * If the given value is already an error, it will be returned as is.
 */
export function toArray<T extends {}>(value: T | readonly T[] | undefined | null): readonly T[] {
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
 */
export function forEach<T extends {}>(value: null | undefined | T | readonly T[], callbackFn: (value: T, index: number) => void): void {
	if (Array.isArray(value)) {
		value.forEach(callbackFn);
	} else if (value != null) {
		callbackFn(value as T, 0);
	}
}

export function capitalize<T extends string>(string: T): Capitalize<T> {
	// This is the internal implementation of `Capitalize<T>` by TS.
	// https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#capitalizestringtype
	return string.charAt(0).toUpperCase() + string.slice(1) as Capitalize<T>;
}

/**
 * Converts the given kebab case identifier to a camel case identifier.
 */
export function kebabToCamelCase<T extends string>(kebab: T): KebabToCamelCase<T> {
	const [first, ...others] = kebab.split(/-/);
	return first + others.map(capitalize).join('') as KebabToCamelCase<T>;
}
