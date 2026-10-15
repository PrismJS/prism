import { loadIife } from './iife.js';

const iife = await loadIife();

// A language imported as a module reaches the instance of the IIFE build without importing Prism
const { default: registry } = await import('../../../src/registry.js');
registry.add({ id: 'added', grammar: {} });

const { default: prism } = await import('../../../src/core/prism.js');

console.log(JSON.stringify({ reused: prism === iife, registered: iife.languageRegistry.has('added') }));
