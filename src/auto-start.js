import globalDefaults from './config.js';
import Prism from './global.js';
import './plugins/autoloader/autoloader.js';
import { documentReady } from './util/async.js';

// Only this entry makes the global instance highlight the page by itself
if (!globalDefaults.manual) {
	Prism.waitFor.push(documentReady());
	Prism.ready.then(() => Prism.highlightAll()).catch(Prism.config.errorHandler);
}

export default Prism;
