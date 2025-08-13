import { KebabToCamelCase } from '../src/types.d.ts';
import { createUtil } from './helper/prism-dom-util.js';
import { useSnapshot } from './helper/snapshot.js';

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

export interface AssertOptions {
	language?: string;
	code: string;
	format?: boolean;
	expected?: string | typeof useSnapshot;
}

export type TestSuiteDom<T extends string> = PrismDOM<{
	plugins: Record<KebabToCamelCase<T>, {}>;
}> & { util: ReturnType<typeof createUtil> };
