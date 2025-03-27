import { Prism } from './core/prism';

const globalSymbol = Symbol.for('Prism global');

// eslint-disable-next-line no-undef
const namespace = globalThis as Partial<Record<typeof globalSymbol, Prism>>;
const globalPrism = (namespace[globalSymbol] ??= new Prism());

/**
 * The global {@link Prism} instance.
 *
 * This instance of Prism is unique. Even if this module is imported from
 * different sources, the same Prism instance will be returned.
 */
export default globalPrism;
