import registry from '../../../src/registry.js';
import { Prism } from '../../../src/core.js';

console.log(JSON.stringify({ isClass: typeof Prism === 'function', created: registry.prism !== undefined }));
