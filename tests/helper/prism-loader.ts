import { readdirSync } from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import { Prism } from '../../src/core/prism';
import { isNonNull, lazy, noop, toArray } from '../../src/shared/util';
import type { ComponentProto, LanguageProto, PluginProto } from '../../src/types';
import type { DOMWindow } from 'jsdom';

const SRC_DIR = path.join(__dirname, '../../src');

export const getLanguageIds = lazy(() => {
	const files = readdirSync(path.join(SRC_DIR, 'languages'));
	return files
		.map((f) => {
			const match = /^prism-([\w-]+)\.[jt]s$/.exec(f);
			if (!match) {
				return undefined;
			}

			const [, id] = match;
			return id;
		})
		.filter(isNonNull);
});
export const getPluginIds = lazy(() => {
	return readdirSync(path.join(SRC_DIR, 'plugins'));
});
export const getComponentIds = lazy(() => [...getLanguageIds(), ...getPluginIds()]);

async function getComponentUncached(id: string) {
	if (getPluginIds().includes(id)) {
		const file = path.join(SRC_DIR, 'plugins', id, `prism-${id}.ts`);
		const exports = (await import(file)) as { default: PluginProto };
		return exports.default;
	} else {
		const file = path.join(SRC_DIR, 'languages', `prism-${id}.ts`);
		const exports = (await import(file)) as { default: LanguageProto };
		return exports.default;
	}
}
const componentCache = new Map<string, Promise<ComponentProto>>();
export function getComponent(id: string) {
	let promise = componentCache.get(id);
	if (promise === undefined) {
		promise = getComponentUncached(id);
		componentCache.set(id, promise);
	}
	return promise;
}

// preload all components
// eslint-disable-next-line @typescript-eslint/no-misused-promises
getComponentIds().forEach(getComponent);

/**
 * Creates a new Prism instance with the given language loaded
 */
export async function createInstance(languages?: string | string[]) {
	const instance = new Prism();

	const protos = await Promise.all(toArray(languages).map(getComponent));
	instance.components.add(...protos);

	return instance;
}

export type PrismWindow<T> = DOMWindow & { Prism: Prism & T };
export interface PrismDOM<T> {
	dom: JSDOM;
	window: PrismWindow<T>;
	document: Document;
	Prism: Prism & T;
	loadLanguages: (languages: string | string[]) => Promise<void>;
	loadPlugins: (plugins: string | string[]) => Promise<void>;
	withGlobals: (fn: () => void) => void;
}

function overwriteProps(target: Record<string, unknown>, source: Record<string, unknown>) {
	const oldProps: [string, unknown][] = [];

	for (const [key, value] of Object.entries(source)) {
		oldProps.push([key, target[key]]);
		target[key] = value;
	}

	return () => {
		for (const [key, value] of oldProps) {
			target[key] = value;
		}
	};
}

/**
 * Creates a new JavaScript DOM instance with Prism being loaded.
 */
export function createPrismDOM(): PrismDOM<{}> {
	const dom = new JSDOM(``, {
		runScripts: 'outside-only',
		url: 'https://example.com/test.html'
	});
	const window = dom.window;

	const instance = new Prism();
	window.Prism = instance;

	const withGlobals = (fn: () => void) => {
		const g = (global as unknown as Record<string, unknown>);
		let undo;
		try {
			undo = overwriteProps(g, {
				window,
				document: window.document,
				navigator: window.navigator,
				location: window.location,
				getComputedStyle: window.getComputedStyle,
				setTimeout: noop
			});
			fn();
		} finally {
			undo?.();
		}
	};

	/**
	 * Loads the given languages or plugins.
	 */
	const load = async (languagesOrPlugins: string | string[]) => {
		const protos = await Promise.all(toArray(languagesOrPlugins).map(getComponent));
		withGlobals(() => {
			instance.components.add(...protos);
		});
	};

	return {
		dom,
		window: (window as PrismWindow<{}>),
		document: window.document,
		Prism: window.Prism as never,
		loadLanguages: load,
		loadPlugins: load,
		withGlobals
	};
}
