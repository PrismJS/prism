import ComponentRegistry from '../../../src/core/classes/component-registry.js';
import registry from '../../../src/registry.js';

// A module script imports a language before the page has any instance, so this copy creates a registry of its own
registry.add({ id: 'added', grammar: {} });

// A `defer` IIFE build runs next. A separate copy of the class stands in for it, with the registry it puts on its instance
const url = new URL('../../../src/core/classes/prism.js?copy', import.meta.url);
const { default: IifePrism } = await import(url.href);
const iife = new IifePrism();
iife.registry = new ComponentRegistry();
iife.registry.subscribe(def => iife.register(def));
globalThis.Prism = iife;

// A later module script imports Prism, which must still find the instance of the IIFE build
const { default: prism } = await import('../../../src/core/prism.js');

console.log(JSON.stringify({ reused: prism === iife, registered: iife.languageRegistry.has('added') }));
