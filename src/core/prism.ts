/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me> and contributors <https://github.com/PrismJS/prism/graphs/contributors>
 */
import Prism from './classes/prism';

/**
 * Prism singleton.
 * This will always be available, and will automatically read config options.
 * This instance of Prism is unique. Even if this module is imported from
 * different sources, the same Prism instance will be returned.
 * In global builds, it will also be the Prism global variable.
 * Any imported plugins and languages will automatically be added to this instance.
 */
const prism = new Prism();
export default prism;

/** See {@link Prism} */
export { Prism };
