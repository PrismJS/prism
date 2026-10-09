import { iifePrism, manual } from './config.js';
import Prism from './global.js';
import './plugins/autoloader/autoloader.js';
import { documentReady } from './util/async.js';

// Only this entry makes the global instance highlight the page by itself.
// The global build (IIFE) is this entry too, so it already ran this check for its instance
if (!manual && !iifePrism) {
	Prism.waitFor.push(documentReady());
	Prism.ready.then(() => Prism.highlightAll()).catch(Prism.config.errorHandler);
}

export default Prism;
