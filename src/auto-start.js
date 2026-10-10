import { manual } from './config.js';
import Prism, { sharedPrism } from './core/prism.js';
import './plugins/autoloader/autoloader.js';
import { documentReady } from './util/async.js';

// Of all entries, only `prismjs` and the IIFE build highlight the page by themselves.
// They do so only in the copy of Prism that created the global instance,
// so a later copy of the same major version never highlights again
if (!manual && !sharedPrism) {
	Prism.waitFor.push(documentReady());
	Prism.ready.then(() => Prism.highlightAll()).catch(Prism.config.errorHandler);
}

export default Prism;
