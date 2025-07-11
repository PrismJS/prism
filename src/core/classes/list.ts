import { toIterable } from '../../util/iterables';

/**
 * Set with some conveniences
 */
export default class List<T> extends Set<T> {
	/**
	 * Alias of `size` so these objects can be handled like arrays
	 */
	get length () {
		return this.size;
	}

	addAll (arg: Iterable<T> | T) {
		if (!arg) {
			return this;
		}

		for (const item of toIterable<T>(arg)) {
			this.add(item);
		}

		return this;
	}
}
