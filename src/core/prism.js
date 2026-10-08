/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me> and contributors <https://github.com/PrismJS/prism/graphs/contributors>
 */
import globalDefaults from '../config.js';
import registry from '../registry.js';
import Prism from './classes/prism.js';

/**
 * Prism singleton.
 * This will always be available, and will automatically read config options.
 * This instance of Prism is unique. Even if this module is imported from
 * different sources, the same Prism instance will be returned.
 * In global builds, it will also be the Prism global variable.
 * When a global build (IIFE) has already set it, this module reuses that instance.
 * Any imported plugins and languages will automatically be added to this instance.
 *
 * @type {Prism}
 */
let prism = globalThis.Prism;

// The IIFE build has its own copy of the class, so `instanceof` would miss its instance.
// That instance already takes everything from the registry
if (prism?.constructor?.name !== 'Prism') {
	prism = new Prism(globalDefaults);

	for (const def of Object.values(registry.cache)) {
		prism.register(def);
	}
	registry.addEventListener('add', e =>
		prism.register(/** @type {CustomEvent} */ (e).detail.component));
}

export default prism;

/** See {@link Prism} */
export { Prism };
