/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me> and contributors <https://github.com/PrismJS/prism/graphs/contributors>
 */
import globalDefaults, { hasDOM, sharedPrism } from '../config.js';
import registry from '../registry.js';
import Prism from './classes/prism.js';

/**
 * The global Prism instance.
 * It reads the page config and gets every language and plugin imported with any copy of Prism on the page.
 * The first copy on a page creates it and puts it in the `Prism` global variable.
 * Every later copy of the same major version, the IIFE build or a module build, uses it.
 *
 * @type {Prism}
 */
let prism = sharedPrism ?? new Prism(globalDefaults);

if (!sharedPrism) {
	prism.registry = registry;

	if (!Prism.isPrism(globalThis.Prism)) {
		// Later copies of Prism on the page, such as the IIFE build, find the instance through the global.
		// Without a DOM, as in Node, no other copy can share it, so no global is set
		if (hasDOM) {
			globalThis.Prism = prism;
		}
	}
	else if (!prism.config.silent) {
		// NOTE: The IIFE build sets `window.Prism` again after this code runs (`var Prism = …` from Rollup's `name`),
		// so next to another major version it still replaces that version's instance
		console.warn(
			`Prism ${Prism.version} can't use the instance of another major version on the page, so it created its own.`
		);
	}
}

// Every copy subscribes its registry, not only the one that created the instance.
// A later copy can still have a registry of its own,
// e.g. css imported by a module script before a `defer` IIFE build created the instance
registry.subscribe(def => prism.register(def));

export default prism;

/** See {@link Prism} */
export { Prism };
