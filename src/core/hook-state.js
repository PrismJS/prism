/**
 * @typedef {(string | symbol) & { __keyType?: T }} StateKey
 * @template {{}} T
 */

/**
 * A simple typed map from some key to its data.
 */
export class HookState {
	/**
	 * @type {Map<string | symbol, {}>}
	 * @private
	 */
	_data = new Map();

	/**
	 * @param {StateKey<{}>} key
	 * @returns {boolean}
	 */
	has(key) {
		return this._data.has(key);
	}

	/**
	 * @param {StateKey<T>} key
	 * @param {T} defaultValue
	 * @returns {T}
	 * @template {{}} T
	 */
	get(key, defaultValue) {
		let current = this._data.get(key);
		if (current === undefined) {
			current = defaultValue;
			this._data.set(key, current);
		}
		return /** @type {T} */ (current);
	}

	/**
	 * @param {StateKey<T>} key
	 * @param {T} value
	 * @returns {void}
	 * @template {{}} T
	 */
	set(key, value) {
		this._data.set(key, value);
	}
}
