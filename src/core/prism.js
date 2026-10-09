/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me> and contributors <https://github.com/PrismJS/prism/graphs/contributors>
 */
import globalDefaults, { iifePrism } from '../config.js';
import registry from '../registry.js';
import Prism from './classes/prism.js';

/**
 * The global Prism instance.
 * It reads the page config and gets every language and plugin imported with this copy of Prism.
 * In global builds (IIFE), it is also the `Prism` global variable.
 * The ESM and CommonJS builds reuse that instance when the page has one.
 * Otherwise each of them creates its own.
 *
 * @type {Prism}
 */
let prism = iifePrism ?? new Prism(globalDefaults);

// The IIFE build has its own registry, so an instance it created still needs this one
registry.subscribe(def => prism.register(def));

export default prism;

/** See {@link Prism} */
export { Prism };
