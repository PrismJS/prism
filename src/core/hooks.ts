import type { Grammar, TokenName } from '../types';
import type { HookState } from './hook-state';
import type { TokenStream } from './token';

export class Hooks {
	// eslint-disable-next-line func-call-spacing
	private _all = new Map<string, ((env: unknown) => void)[]>();

	/**
	 * Adds the given callback to the list of callbacks for the given hook and returns a function that
	 * removes the hook again when called.
	 *
	 * The callback will be invoked when the hook it is registered for is run.
	 * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
	 *
	 * One callback function can be registered to multiple hooks.
	 *
	 * A callback function must not be registered for the same hook multiple times. Doing so will cause
	 * undefined behavior. However, registering a callback again after removing it is fine.
	 *
	 * @param name The name of the hook.
	 * @param callback The callback function which is given environment variables.
	 */
	add<Name extends string>(name: Name, callback: HookCallback<Name>): () => void {
		let hooks = this._all.get(name);
		if (hooks === undefined) {
			hooks = [];
			this._all.set(name, hooks);
		}
		const list = hooks;

		list.push(callback as never);

		return () => {
			const index = list.indexOf(callback as never);
			if (index !== -1) {
				list.splice(index, 1);
			}
		};
	}

	/**
	 * Runs a hook invoking all registered callbacks with the given environment variables.
	 *
	 * Callbacks will be invoked synchronously and in the order in which they were registered.
	 *
	 * @param name The name of the hook.
	 * @param env The environment variables of the hook passed to all callbacks registered.
	 */
	run<Name extends string>(name: Name, env: HookEnv<Name>): void {
		const callbacks = this._all.get(name);

		if (!callbacks || !callbacks.length) {
			return;
		}

		for (const callback of callbacks) {
			callback(env);
		}
	}
}


/**
 * An interface containing all hooks Prism runs.
 */
export interface HookEnvMap {
	// Prism.highlightAll
	'before-highlightall': BeforeHighlightAllEnv;
	'before-all-elements-highlight': BeforeAllElementsHighlightEnv;

	// Prism.highlightElement
	'before-sanity-check': BeforeSanityCheckEnv;
	'before-highlight': BeforeHighlightEnv;

	'before-insert': BeforeInsertEnv;
	'after-highlight': AfterHighlightEnv;
	'complete': CompleteEnv;

	// Prism.highlight
	'before-tokenize': BeforeTokenizeEnv;
	'after-tokenize': AfterTokenizeEnv;

	// stringify
	'wrap': WrapEnv;
}

export type HookEnv<HookName extends string> = HookName extends keyof HookEnvMap ? HookEnvMap[HookName] : unknown;

export type HookCallback<HookName extends string> = (env: HookEnv<HookName>) => void;

interface StatefulEnv {
	readonly state: HookState;
}

export interface BeforeHighlightAllEnv extends StatefulEnv {
	root: ParentNode;
	selector: string;
	callback?: (element: Element) => void;
}
export interface BeforeAllElementsHighlightEnv extends StatefulEnv {
	root: ParentNode;
	selector: string;
	callback?: (element: Element) => void;
	elements: Element[];
}

export interface BeforeSanityCheckEnv extends StatefulEnv {
	element: Element;
	language: string;
	grammar: Grammar | undefined;
	code: string;
}
export interface BeforeHighlightEnv extends StatefulEnv {
	element: Element;
	language: string;
	grammar: Grammar | undefined;
	code: string;
}
export interface CompleteEnv extends StatefulEnv {
	element: Element;
	language: string;
	grammar: Grammar | undefined;
	code: string;
}
export interface BeforeInsertEnv extends StatefulEnv {
	element: Element;
	language: string;
	grammar: Grammar | undefined;
	code: string;
	highlightedCode: string;
}
export interface AfterHighlightEnv extends StatefulEnv {
	element: Element;
	language: string;
	grammar: Grammar | undefined;
	code: string;
	highlightedCode: string;
}

export interface BeforeTokenizeEnv {
	code: string;
	language: string;
	grammar: Grammar | undefined;
}
export interface AfterTokenizeEnv {
	code: string;
	language: string;
	grammar: Grammar;
	tokens: TokenStream;
}

export interface WrapEnv {
	type: TokenName;
	content: string;
	tag: string;
	classes: string[];
	attributes: Record<string, string>;
	language: string;
}
