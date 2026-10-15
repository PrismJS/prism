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
 * The global instance, if another copy of Prism created it before this one, such as the IIFE build.
 * Its registry is the one `registry.js` found in the `Prism` global variable.
 *
 * @type {Prism | undefined}
 */
export const existingPrism = registry.prism;

/**
 * The global Prism instance.
 * It reads the page config and gets every imported language and plugin.
 * In the IIFE build, it is also the `Prism` global variable, and later copies of Prism use it.
 *
 * @type {Prism}
 */
let prism = existingPrism ?? new Prism(globalDefaults);

if (!existingPrism) {
	registry.prism = prism;
	prism.registry = registry;
	registry.subscribe(def => prism.register(def));
}

export default prism;

/** See {@link Prism} */
export { Prism };
