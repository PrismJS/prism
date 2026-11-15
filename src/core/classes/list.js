import { toIterable } from '../../util/iterables.js';

/**
 * Set with some conveniences.
 *
 * @template T
 */
export default class List extends Set {
	/**
	 * Alias of `size` so these objects can be handled like arrays
	 */
	get length () {
		return this.size;
	}

	/**
	 * @param {Iterable<T> | T} arg
	 * @returns
	 */
	addAll (arg) {
		if (!arg) {
			return this;
		}

		for (const item of toIterable(arg)) {
			this.add(item);
		}

		return this;
	}
}
