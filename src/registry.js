import ComponentRegistry from './core/classes/component-registry.js';

/**
 * Every language and plugin imported so far.
 * The global instance applies all of them, other instances only what their `register()` gets.
 * The global key lets the IIFE build and the ESM and CommonJS copies of Prism share one registry.
 *
 * @type {ComponentRegistry<ComponentProto>}
 */
export default /** @type {any} */ (globalThis)[Symbol.for('prismjs.registry')] ??=
	new ComponentRegistry();

/** @import { ComponentProto } from './types.d.ts' */
