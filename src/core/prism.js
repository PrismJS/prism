/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me> and contributors <https://github.com/PrismJS/prism/graphs/contributors>
 */
import globalDefaults, { hasDOM } from '../config.js';
import { findSharedPrism } from '../find-shared-prism.js';
import registry from '../registry.js';
import Prism from './classes/prism.js';

/**
 * The global instance, if another copy of Prism of the same major version created it before this copy ran.
 * `undefined` when this copy creates the instance itself.
 *
 * @type {Prism | undefined}
 */
export const sharedPrism = findSharedPrism();

/**
 * The global Prism instance: {@link sharedPrism} when another copy created it, otherwise a new instance.
 * It reads the page config and gets every language and plugin imported with any copy of Prism of the same major version on the page.
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
		console.warn(
			`Prism ${Prism.version} can't use the instance of another major version on the page, so it created its own.`
		);
	}
}

// The copy that created the instance subscribed its registry, and `registry.js` in a later copy takes that registry from the global.
// A second listener would call `register()` twice for each new component, so a later copy subscribes only a registry of its own,
// e.g. css imported by a module script before a `defer` IIFE build created the instance
if (registry !== sharedPrism?.registry) {
	registry.subscribe(def => prism.register(def));
}

export default prism;

/** See {@link Prism} */
export { Prism };
