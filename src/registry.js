import ComponentRegistry from './core/classes/component-registry.js';

/**
 * Every imported language and plugin.
 * The global instance registers all of them, other instances only what their `register()` gets.
 * Next to the IIFE build, it is the registry of the IIFE instance, so a language imported as a module reaches that instance too.
 *
 * @type {ComponentRegistry<ComponentProto>}
 */
export default globalThis.Prism?.registry ?? new ComponentRegistry();

/** @import { ComponentProto } from './types.d.ts' */
