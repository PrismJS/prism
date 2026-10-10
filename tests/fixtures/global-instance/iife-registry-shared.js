import { getEventListeners } from 'node:events';
import ComponentRegistry from '../../../src/core/classes/component-registry.js';

// A separate copy of the class stands in for the IIFE build, which puts its registry on its instance
const url = new URL('../../../src/core/classes/prism.js?copy', import.meta.url);
const { default: IifePrism } = await import(url.href);
const iife = new IifePrism();
iife.registry = new ComponentRegistry();
iife.registry.subscribe(def => iife.register(def));
globalThis.Prism = iife;

const { default: registry } = await import('../../../src/registry.js');
await import('../../../src/core/prism.js');

console.log(
	JSON.stringify({
		shared: registry === iife.registry,
		listeners: getEventListeners(iife.registry, 'add').length,
	})
);
