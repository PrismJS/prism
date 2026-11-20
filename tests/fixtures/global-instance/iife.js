import { register } from 'node:module';

register('./iife-hooks.js', import.meta.url);

/**
 * Runs the IIFE build: a separate copy of every module of `auto-start.js`, the entry of that build.
 * Its `var Prism = …` puts the instance in the `Prism` global variable.
 */
export async function loadIife () {
	const url = new URL('../../../src/auto-start.js?iife', import.meta.url);
	const { default: prism } = await import(url.href);
	globalThis.Prism = prism;
	return prism;
}
