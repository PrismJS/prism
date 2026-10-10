import { allSettled } from '../../util/async.js';

/**
 * @template {ComponentProto} T
 */
export default class ComponentRegistry extends EventTarget {
	static type = 'unknown';

	/**
	 * All imported components.
	 *
	 * @type {Record<string, T>}
	 */
	cache = {};

	/**
	 * All components that are currently being loaded.
	 *
	 * @type {Record<string, Promise<T>>}
	 */
	loading = {};

	/**
	 * Same data as in loading, but as an array, used for aggregate promises.
	 * IMPORTANT: Do NOT overwrite this array, only modify its contents.
	 *
	 * @type {Promise<T>[]}
	 */
	#loadingList = [];

	/**
	 * @type {Promise<T[]>}
	 */
	ready;

	/**
	 * Path to the components, used for loading.
	 *
	 * @type {string | undefined}
	 */
	path;

	/**
	 * A reference to the Prism instance.
	 *
	 * @type {Prism}
	 */
	prism;

	/**
	 * @type {ComponentRegistryOptions}
	 */
	options;

	/**
	 *
	 * @param {ComponentRegistryOptions} [options]
	 */
	constructor (options = {}) {
		super();

		this.options = options;
		let { path, preload, prism } = options;

		// Only the registry in registry.js has no instance, and it never reads `prism`
		this.prism = /** @type {Prism} */ (prism);

		if (path) {
			this.path = path.endsWith('/') ? path : path + '/';
		}

		if (preload) {
			void this.loadAll(preload);
		}

		this.ready = /** @type {Promise<T[]>} */ (allSettled(this.#loadingList));
	}

	/**
	 * Returns the component if it is already loaded or a promise that resolves when it is loaded,
	 * without triggering a load like `load()` would.
	 *
	 * @param {string} id
	 * @returns {Promise<T>}
	 */
	async whenDefined (id) {
		if (this.cache[id]) {
			// Already loaded
			return this.cache[id];
		}

		if (this.loading[id] !== undefined) {
			// Already loading
			return this.loading[id];
		}

		const Self = /** @type {typeof ComponentRegistry} */ (this.constructor);
		return new Promise(resolve => {
			/**
			 * @param {CustomEvent<AddEventPayload<T>>} e
			 */
			const handler = e => {
				if (e.detail.id === id) {
					resolve(e.detail.component);
					this.removeEventListener(
						'add' + Self.type,
						/** @type {EventListener} */ (handler)
					);
				}
			};
			this.addEventListener('add' + Self.type, /** @type {EventListener} */ (handler));
		});
	}

	/**
	 * Add a component to the registry.
	 *
	 * @param {T} def Component
	 * @param {string} [id=def.id] Component id
	 * @param {object} [options] Options
	 * @param {boolean} [options.force] Force add the component even if it is already present
	 * @returns {boolean} true if the component was added, false if it was already present
	 */
	add (def, id = def.id, options) {
		const Self = /** @type {typeof ComponentRegistry} */ (this.constructor);

		if (typeof this.loading[id] !== 'undefined') {
			// If it was loading, remove it from the loading list
			const index = this.#loadingList.indexOf(this.loading[id]);
			if (index > -1) {
				this.#loadingList.splice(index, 1);
			}

			delete this.loading[id];
		}

		if (!this.cache[id] || options?.force) {
			this.cache[id] = def;

			this.dispatchEvent(
				/** @type {CustomEvent<AddEventPayload<T>>} */
				new CustomEvent('add', {
					detail: { id, type: Self.type, component: def },
				})
			);

			this.dispatchEvent(
				/** @type {CustomEvent<AddEventPayload<T>>} */
				new CustomEvent('add' + Self.type, {
					detail: { id, component: def },
				})
			);

			return true;
		}

		return false;
	}

	/**
	 * Calls `callback` with every component the registry has now, then with each one added later.
	 *
	 * @param {(component: T) => void} callback
	 * @returns {() => void} Stops calls for components added later
	 */
	subscribe (callback) {
		for (const component of Object.values(this.cache)) {
			callback(component);
		}

		/** @param {Event} e */
		let listener = e =>
			callback(/** @type {CustomEvent<AddEventPayload<T>>} */ (e).detail.component);
		this.addEventListener('add', listener);
		return () => this.removeEventListener('add', listener);
	}

	/**
	 *
	 * @param {string} id
	 * @returns {boolean}
	 */
	has (id) {
		return this.cache[id] !== undefined;
	}

	/**
	 *
	 * @param {string} id
	 * @returns {T | null}
	 */
	get (id) {
		return this.cache[id] ?? null;
	}

	/**
	 *
	 * @param {string} id
	 * @returns {T | Promise<T | null>}
	 */
	load (id) {
		if (this.cache[id]) {
			return this.cache[id];
		}

		if (this.loading[id] !== undefined) {
			// Already loading
			return this.loading[id];
		}

		if (!this.path) {
			throw new Error(
				`Cannot load "${id}" because the registry has no "path" to load component files from. ` +
					'Pass "path" when you create the registry, or add the component with "add()" instead.'
			);
		}

		const loadingComponent = import(this.path + id + '.js')
			.then(m => {
				/** @type {T} */
				const component = m.default ?? m;
				this.add(component, id);
				return component;
			})
			.catch(error => {
				console.error(error);
				return null;
			});

		this.loading[id] = /** @type {Promise<T>} */ (loadingComponent);
		this.#loadingList.push(/** @type {Promise<T>} */ (loadingComponent));
		return loadingComponent;
	}

	/**
	 *
	 * @param {string[]} ids
	 * @returns {(T | Promise<T | null>)[]}
	 */
	loadAll (ids) {
		if (!Array.isArray(ids)) {
			ids = [ids];
		}

		return ids.map(id => this.load(id));
	}
}

/**
 * @import {Prism} from '../prism.js'
 * @import {ComponentProto} from '../../types.d.ts'
 */

/**
 * @typedef {object} ComponentRegistryOptions
 * @property {string} [path] Path to the components
 * @property {string[]} [preload] List of component ids to preload
 * @property {Prism} [prism] A reference to the Prism instance
 */

/**
 * @template {ComponentProto} T
 * @typedef {object} AddEventPayload
 * @property {string} id
 * @property {string} [type]
 * @property {T} component
 */
