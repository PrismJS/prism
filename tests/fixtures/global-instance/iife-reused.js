import './set-version.js';

// A separate copy of the class, like the one inside the IIFE build of another version
const url = new URL('../../../src/core/classes/prism.js?copy', import.meta.url);
const { default: IifePrism } = await import(url.href);
IifePrism.version = process.argv[3];
const iife = new IifePrism();
globalThis.Prism = iife;

const { default: prism } = await import('../../../src/core/prism.js');
const { default: registry } = await import('../../../src/registry.js');
registry.add({ id: 'added', grammar: {} });

console.log(JSON.stringify({ reused: prism === iife, registered: iife.languageRegistry.has('added') }));
