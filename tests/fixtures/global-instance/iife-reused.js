// A separate copy of the class, like the one inside the IIFE build
const url = new URL('../../../src/core/classes/prism.js?copy', import.meta.url);
const { default: IifePrism } = await import(url.href);
const iife = new IifePrism();
globalThis.Prism = iife;

const { default: prism } = await import('../../../src/core/prism.js');
const { default: registry } = await import('../../../src/registry.js');
registry.add({ id: 'added', grammar: {} });

console.log(JSON.stringify({ reused: prism === iife, registered: iife.languageRegistry.has('added') }));
