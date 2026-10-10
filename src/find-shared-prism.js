import { isCompatible } from './version.js';

/**
 * Finds the instance that another copy of Prism (the IIFE build or a module build) put in `globalThis.Prism`,
 * if this copy can share it.
 * It calls `isPrism()` of the value's own class, because importing the class here would put it into every language.
 *
 * @returns {Prism | undefined}
 */
export function findSharedPrism () {
	let value = globalThis.Prism;
	return value?.constructor?.isPrism?.(value) && isCompatible(value.constructor.version)
		? value
		: undefined;
}

/** @import Prism from './core/classes/prism.js' */
