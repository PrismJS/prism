import Prism from './global.js';
import autoloader from './plugins/autoloader/autoloader.js';
import { documentReady } from './util/async.js';

Prism.components.add(autoloader);

documentReady().then(() => {
	if (!Prism.config.manual) {
		Prism.highlightAll();
	}
});

export default Prism;
