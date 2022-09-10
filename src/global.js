import { Prism } from './core/prism.js';

const globalSymbol = Symbol.for('Prism global');

// eslint-disable-next-line no-undef
const namespace = /** @type {Partial<Record<globalSymbol, Prism>>} */ (globalThis);
const globalPrism = namespace[globalSymbol] ??= new Prism();

/**
 * The global {@link Prism} instance.
 *
 * This instance of Prism is unique. Even if this module is imported from
 * different sources, the same Prism instance will be returned.
 */
export default globalPrism;
