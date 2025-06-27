import Prism from './global';
import autoloader from './plugins/autoloader/prism-autoloader';
import { documentReady } from './util/async';

Prism.components.add(autoloader);

export const PrismConfig = {
	// TODO: Update docs
	/**
	 * By default, Prism will attempt to highlight all code elements (by calling {@link Prism#highlightAll}) on the
	 * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
	 * additional languages or plugins yourself.
	 *
	 * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
	 *
	 * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
	 * empty Prism object into the global scope before loading the Prism script like this:
	 *
	 * ```js
	 * window.Prism = window.Prism || {};
	 * Prism.manual = true;
	 * // add a new <script> to load Prism's script
	 * ```
	 *
	 * @default false
	 */
	manual: false,
};

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	// Get current script and highlight
	const script = document.currentScript as HTMLScriptElement | null;
	if (script && script.hasAttribute('data-manual')) {
		PrismConfig.manual = true;
	}

	void documentReady().then(() => {
		if (!PrismConfig.manual) {
			Prism.highlightAll();
		}
	});
}
else {
	PrismConfig.manual = true;
}

export default Prism;
