import { manual } from './config.js';
import Prism, { existingPrism } from './core/prism.js';
import './plugins/autoloader/autoloader.js';
import { documentReady } from './util/async.js';

// Of all entries, only the package's main entry (`prismjs`) and the IIFE build highlight the page by themselves.
// When another copy of Prism created the instance, that copy decides whether to highlight the page, so this one does not.
if (!manual && !existingPrism) {
	Prism.waitFor.push(documentReady());
	Prism.ready.then(() => Prism.highlightAll()).catch(Prism.config.errorHandler);
}

export default Prism;
