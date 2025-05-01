import { allSettled } from '../../util';
import type { ComponentProto } from '../../types';

export interface ComponentRegistryOptions {
	/** Path to the components */
	path: string;
	preload?: string[];
}

export interface ComponentProtoBase<Id extends string = string> {
	id: Id;
	// FIXME: This is a circular type dependency: ComponentProto -> ComponentProtoBase -> Registry -> ComponentProto
	require?: ComponentProto | readonly ComponentProto[];
	optional?: string | readonly string[];
}

export default class Registry<T extends ComponentProto> extends EventTarget {
	static type: string = 'unknown';

	/** All imported components */
	cache: Record<string, T> = {};

	/** All components that are currently being loaded */
	loading: Record<string, Promise<T | null>> = {};

	/**
	 * Same data as in loading, but as an array, used for aggregate promises.
	 * IMPORTANT: Do NOT overwrite this array, only modify its contents.
	 */
	private loadingList: Promise<T | null>[] = [];

	ready: Promise<(T | null)[]>;

	/** Path to the components, used for loading */
	path: string;

	options: ComponentRegistryOptions;

	constructor (options: ComponentRegistryOptions) {
		super();
		this.options = options;
		let { path, preload } = options;
		path = path.endsWith('/') ? path : path + '/';
		this.path = path;

		if (preload) {
			void this.loadAll(preload);
		}

		this.ready = allSettled(this.loadingList);
	}

	/**
	 * Returns the component if it is already loaded or a promise that resolves when it is loaded,
	 * without triggering a load like `load()` would.
	 *
	 * @param id
	 * @returns
	 */
	async whenDefined (id: string): Promise<T | null> {
		if (this.cache[id]) {
			// Already loaded
			return this.cache[id];
		}

		if (this.loading[id] !== undefined) {
			// Already loading
			return this.loading[id];
		}

		let Self = this.constructor as typeof Registry;
		return new Promise(resolve => {
			let handler = (e: CustomEvent<{ id: string; type?: string; component: T }>) => {
				if (e.detail.id === id) {
					resolve(e.detail.component);
					this.removeEventListener('add', handler as EventListener);
				}
			};
			this.addEventListener('add' + Self.type, handler as EventListener);
		});
	}

	/**
	 * Add a component to the registry.
	 *
	 * @param def Component
	 * @param id Component id
	 * @param options Options
	 * @param options.force Force add the component even if it is already present
	 * @returns true if the component was added, false if it was already present
	 */
	add (def: T, id: string = def.id, options?: { force?: boolean }): boolean {
		let Self = this.constructor as typeof Registry;

		if (typeof this.loading[id] !== 'undefined') {
			// If it was loading, remove it from the loading list
			let index = this.loadingList.indexOf(this.loading[id]);
			if (index > -1) {
				this.loadingList.splice(index, 1);
			}

			delete this.loading[id];
		}

		if (!this.cache[id] || options?.force) {
			this.cache[id] = def;

			this.dispatchEvent(
				new CustomEvent('add', { detail: { id, type: Self.type, component: def } })
			);
			this.dispatchEvent(
				new CustomEvent('add' + Self.type, { detail: { id, component: def } })
			);

			return true;
		}

		return false;
	}

	has (id: string): boolean {
		return this.cache[id] !== undefined;
	}

	get (id: string): T | null {
		return this.cache[id] ?? null;
	}

	load (id: string): T | Promise<T | null> {
		if (this.cache[id]) {
			return this.cache[id];
		}

		if (this.loading[id] !== undefined) {
			// Already loading
			return this.loading[id];
		}

		let loadingComponent = import(this.path + id)
			.then(m => {
				let component: T = m.default ?? m;
				this.add(component, id);
				return component;
			})
			.catch(error => {
				console.error(error);
				return null;
			});

		this.loading[id] = loadingComponent;
		this.loadingList.push(loadingComponent);
		return loadingComponent;
	}

	loadAll (ids: string[]): (T | Promise<T | null>)[] {
		if (!Array.isArray(ids)) {
			ids = [ids];
		}

		return ids.map(id => this.load(id));
	}
}
