import globalPrism, { Prism } from './core/prism';

declare global {
	var Prism: Prism | undefined
}

/**
 * The global {@link Prism} instance.
 *
 * This instance of Prism is unique. Even if this module is imported from
 * different sources, the same Prism instance will be returned.
 */
export default globalPrism;
