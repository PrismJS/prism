export type StateKey<T> = (string | symbol) & { __keyType?: T };

/**
 * A simple typed map from some key to its data.
 */
export class HookState {
	private _data = new Map<string | symbol, {}>();

	has(key: StateKey<{}>): boolean {
		return this._data.has(key);
	}

	get<T extends {}>(key: StateKey<T>, defaultValue: T) {
		let current = this._data.get(key);
		if (current === undefined) {
			current = defaultValue;
			this._data.set(key, current);
		}
		return current as T;
	}

	set<T extends {}>(key: StateKey<T>, value: T): void {
		this._data.set(key, value);
	}
}
