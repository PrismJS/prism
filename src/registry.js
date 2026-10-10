import ComponentRegistry from './core/classes/component-registry.js';
import { findSharedPrism } from './find-shared-prism.js';

/**
 * Every language and plugin imported with this copy of Prism or with another copy of the same major version that shares this registry.
 * The global instance applies all of them, other instances only what their `register()` gets.
 *
 * @type {ComponentRegistry<ComponentProto>}
 */
export default findSharedPrism()?.registry ?? new ComponentRegistry();

/** @import { ComponentProto } from './types.d.ts' */
