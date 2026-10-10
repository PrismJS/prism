import prism from '../../../src/core/prism.js';
import registry from '../../../src/registry.js';

registry.add({ id: 'added-after', grammar: {} });

console.log(JSON.stringify({ registered: prism.languageRegistry.has('added-after') }));
