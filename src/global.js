import globalPrism from './core/prism.js';

/**
 * The global {@link Prism} instance.
 *
 * This instance of Prism is unique. Even if this module is imported from
 * different sources, the same Prism instance will be returned.
 *
 * When a global build (IIFE) has already set `globalThis.Prism`, this
 * module reuses that instance so ESM plugins share the same singleton.
 */
export default globalThis.Prism?.constructor?.name === 'Prism' ? globalThis.Prism : globalPrism;
