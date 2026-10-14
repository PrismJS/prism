import registry from '../../../src/registry.js';

registry.add({ id: 'added-before', grammar: {} });
const { default: prism } = await import('../../../src/core/prism.js');

console.log(JSON.stringify({ registered: prism.languageRegistry.has('added-before') }));
