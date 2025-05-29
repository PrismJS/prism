export function documentReady (document = globalThis.document) {
	const script = document.currentScript as HTMLScriptElement | null;

	if (!document) {
		return Promise.reject();
	}

	// If the document state is "loading", then we'll use DOMContentLoaded.
	// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
	// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
	// might take longer one animation frame to execute which can create a race condition where only some plugins have
	// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
	// See https://github.com/PrismJS/prism/issues/2102
	// See https://github.com/PrismJS/prism/issues/3535
	const readyState = document.readyState;
	if (
		readyState === 'loading' ||
		(readyState === 'interactive' && script && script.defer && !script.async)
	) {
		return new Promise(resolve => {
			document.addEventListener('DOMContentLoaded', resolve, { once: true });
		});
	}

	return Promise.resolve();
}

export function nextTick () {
	return new Promise(resolve => {
		if (typeof requestAnimationFrame === 'function') {
			requestAnimationFrame(resolve);
		}
		else if (typeof setImmediate === 'function') {
			setImmediate(resolve);
		}
		else {
			setTimeout(resolve, 0);
		}
	});
}

export async function allSettled<T> (promises: Promise<T>[]): Promise<(T | null)[]> {
	const outcomes = await Promise.allSettled(promises);
	return outcomes.map(o => (o.status === 'fulfilled' ? o.value : null));
}

export class Deferred<T> extends Promise<T> {
	executor?: ConstructorParameters<typeof Promise<T>>[0];
	resolve: (value: T | Promise<T>) => void = () => {};
	reject: (reason?: Error) => void = () => {};

	constructor (executor?: ConstructorParameters<typeof Promise<T>>[0]) {
		super((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			executor?.(resolve, reject);
		});
		this.executor = executor;
	}
}

type DeferredPromise<T> = Promise<T> & {
	resolve: (value: T) => void;
	reject: (reason?: any) => void;
};

export function defer<T> (): DeferredPromise<T> {
	let res!: (value: T) => void;
	let rej!: (reason?: any) => void;

	let promise = new Promise<T>((resolve, reject) => {
		res = resolve;
		rej = reject;
	}) as DeferredPromise<T>;

	promise.resolve = res;
	promise.reject = rej;

	return promise;
}
