import Prism from './global';
import autoloader from './plugins/autoloader/prism-autoloader';

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
	 * @public
	 */
	manual: false
};

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	// Get current script and highlight
	const script = document.currentScript as HTMLScriptElement | null;
	if (script && script.hasAttribute('data-manual')) {
		PrismConfig.manual = true;
	}

	const highlightAutomaticallyCallback = () => {
		if (!PrismConfig.manual) {
			Prism.highlightAll();
		}
	};

	// If the document state is "loading", then we'll use DOMContentLoaded.
	// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
	// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
	// might take longer one animation frame to execute which can create a race condition where only some plugins have
	// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
	// See https://github.com/PrismJS/prism/issues/2102
	// See https://github.com/PrismJS/prism/issues/3535
	const readyState = document.readyState;
	if (readyState === 'loading' || readyState === 'interactive' && script && script.defer && !script.async) {
		document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
	} else {
		window.requestAnimationFrame(highlightAutomaticallyCallback);
	}
} else {
	PrismConfig.manual = true;
}

export default Prism;
