import { Prism } from '../../../src/core.js';
import registry from '../../../src/registry.js';

console.log(
	JSON.stringify({ isClass: typeof Prism === 'function', created: registry.prism !== undefined })
);
