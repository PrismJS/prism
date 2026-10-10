import { JSDOM } from 'jsdom';

const { window } = new JSDOM();
Object.assign(globalThis, { window, document: window.document });

// A page config is read and then replaced, as in v1
globalThis.Prism = { silent: true };

// No other copy of Prism is on the page yet, so this one creates the global instance
const { default: prism } = await import('../../../src/core/prism.js');

// A later copy of Prism, like the IIFE build, evaluates its own copy of the registry module, which takes the registry of the instance
const { default: registry } = await import(new URL('../../../src/registry.js?copy', import.meta.url).href);
registry.add({ id: 'added', grammar: {} });

console.log(
	JSON.stringify({
		published: globalThis.Prism === prism,
		registered: prism.languageRegistry.has('added'),
	})
);
