import ComponentRegistry from './core/classes/component-registry.js';

/**
 * Every language and plugin imported with any copy of Prism on the page.
 * The global instance applies all of them, other instances only what their `register()` gets.
 *
 * @type {ComponentRegistry<ComponentProto>}
 */
// NOTE: Next to another major version, this is that version's registry,
// so both instances get each other's languages and plugins
export default globalThis.Prism?.registry ?? new ComponentRegistry();

/** @import { ComponentProto } from './types.d.ts' */
