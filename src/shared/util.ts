import type { KebabToCamelCase } from '../types';

/**
 * Returns a function that caches the result of the given supplier.
 */
export function lazy<T> (supplier: () => T): () => T {
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

export function htmlEncode (text: string): string {
	return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('\u00a0', ' ');
}

/**
 * A function that does nothing.
 */
export const noop = (() => {
	/* noop */
}) as () => void & undefined;

export function isNonNull<T> (value: T): value is T & {} {
	return value != null;
}

declare global {
	interface RegExpConstructor {
		/**
		 * Escapes special characters in a string for use in a regular expression.
		 *
		 * @param str The string to escape.
		 */
		escape (str: string): string;
	}
}

/**
 * Escapes all special regex characters in the given string.
 */
export const regexEscape: (string: string) => string =
	RegExp.escape?.bind(RegExp) ??
	((str: string) => {
		return str.replace(/([\\[\](){}+*?|^$.])/g, '\\$1');
	});

export function capitalize<T extends string> (string: T): Capitalize<T> {
	// This is the internal implementation of `Capitalize<T>` by TS.
	// https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#capitalizestringtype
	return (string.charAt(0).toUpperCase() + string.slice(1)) as Capitalize<T>;
}

/**
 * Converts the given kebab case identifier to a camel case identifier.
 */
export function kebabToCamelCase<T extends string> (kebab: T): KebabToCamelCase<T> {
	const [first, ...others] = kebab.split(/-/);
	return (first + others.map(capitalize).join('')) as KebabToCamelCase<T>;
}

export function camelToKebabCase (str: string) {
	return (str + '').replace(/[A-Z]/g, l => '-' + l.toLowerCase());
}
