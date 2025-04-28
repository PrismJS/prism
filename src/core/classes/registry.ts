import { allSettled } from '../../util';

export interface ComponentRegistryOptions {
	/** Path to the components */
	path: string;
	preload?: string[];
}

export default class Registry<T> {
	/** All imported components */
	cache: Record<string, T> = {};

	/** All components that are currently being loaded */
	loading: Record<string, Promise<T | null>> = {};
	loadingList: Promise<T | null>[] = [];
	ready: Promise<(T | null)[]>;

	options: ComponentRegistryOptions;
	path: string;

	constructor (options: ComponentRegistryOptions) {
		this.options = options;
		let { path, preload } = options;
		path = path.endsWith('/') ? path : path + '/';
		this.path = path;

		if (preload) {
			void this.loadAll(preload);
		}

		this.ready = allSettled(this.loadingList);
	}

	add (id: string, component: T) {
		if (typeof this.loading[id] !== 'undefined') {
			let index = this.loadingList.indexOf(this.loading[id]);
			if (index > -1) {
				this.loadingList.splice(index, 1);
			}

			delete this.loading[id];
		}

		this.cache[id] = component;
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
				let component = m.default ?? m;
				this.add(id, component);
				return component;
			})
			.catch(console.error);

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
