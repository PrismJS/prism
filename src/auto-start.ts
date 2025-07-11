import Prism from './global';
import autoloader from './plugins/autoloader/prism-autoloader';
import { documentReady } from './util/async';

Prism.components.add(autoloader);

void documentReady().then(() => {
	if (!Prism.config.manual) {
		Prism.highlightAll();
	}
});

export default Prism;
