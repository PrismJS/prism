import ComponentRegistry from './core/classes/component-registry.js';

/**
 * Every language and plugin imported with this copy of Prism.
 * The global instance applies all of them, other instances only what their `register()` gets.
 *
 * @type {ComponentRegistry<ComponentProto>}
 */
export default new ComponentRegistry();

/** @import { ComponentProto } from './types.d.ts' */
