import { addHooks } from '../../shared/hooks-util.js';


let jsonpCallbackCounter = 0;

/**
 * Makes a JSONP request.
 *
 * @param {string} src The URL of the resource to request.
 * @param {string | undefined | null} callbackParameter The name of the callback parameter. If falsy, `"callback"`
 * will be used.
 * @param {number} timeout
 * @param {(data: unknown) => void} onSuccess
 * @param {(reason: "timeout" | "network") => void} onError
 * @returns {void}
 */
function jsonp(src, callbackParameter, timeout, onSuccess, onError) {
	const callbackName = 'prismjsonp' + jsonpCallbackCounter++;

	const uri = document.createElement('a');
	uri.href = src;
	uri.href += (uri.search ? '&' : '?') + (callbackParameter || 'callback') + '=' + callbackName;

	const script = document.createElement('script');
	script.src = uri.href;
	script.onerror = function () {
		cleanup();
		onError('network');
	};

	const timeoutId = setTimeout(() => {
		cleanup();
		onError('timeout');
	}, timeout);


	const global = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (window));

	function cleanup() {
		clearTimeout(timeoutId);
		document.head.removeChild(script);
		delete global[callbackName];
	}

	/**
	 * The JSONP callback function
	 *
	 * @param {unknown} response
	 */
	global[callbackName] = (response) => {
		cleanup();
		onSuccess(response);
	};

	document.head.appendChild(script);
}


const STATUS_ATTR = 'data-jsonp-status';
const STATUS_LOADING = 'loading';
const STATUS_LOADED = 'loaded';
const STATUS_FAILED = 'failed';

const SELECTOR = 'pre[data-jsonp]:not([' + STATUS_ATTR + '="' + STATUS_LOADED + '"])'
	+ ':not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';


/**
 * @callback Adapter
 * @param {any} response
 * @param {HTMLPreElement} pre
 * @returns {string | null}
 */

export class JsonpHighlight {
	/**
	 * The timeout after which an error message will be displayed.
	 *
	 * __Note:__ If the request succeeds after the timeout, it will still be processed and will override any
	 * displayed error messages.
	 */
	timeout = 5000;

	/**
	 *
	 * @param {import('../../core/prism.js').Prism} Prism
	 */
	constructor(Prism) {
		/** @private */
		this.Prism = Prism;

		/**
		 * The list of adapter which will be used if `data-adapter` is not specified.
		 *
		 * @type {{adapter: Adapter, name: string}[]}
		 * @private
		 */
		this.adapters = [];
	}


	/**
	 * Returns the given adapter itself, if registered, or a registered adapter with the given name.
	 *
	 * If no fitting adapter is registered, `null` will be returned.
	 *
	 * @param {string | Adapter} adapter The adapter itself or the name of an adapter.
	 * @private
	 */
	getAdapter(adapter) {
		if (typeof adapter === 'function') {
			for (const item of this.adapters) {
				if (item.adapter.valueOf() === adapter.valueOf()) {
					return item.adapter;
				}
			}
		} else if (typeof adapter === 'string') {
			// eslint-disable-next-line no-redeclare
			for (const item of this.adapters) {
				if (item.name === adapter) {
					return item.adapter;
				}
			}
		}
		return null;
	}

	/**
	 * Adds a new function to the list of adapters.
	 *
	 * If the given adapter is already registered or not a function or there is an adapter with the given name already,
	 * nothing will happen.
	 *
	 * @param {string} name The name of the adapter.
	 * @param {Adapter} adapter The adapter to be registered.
	 */
	registerAdapter(name, adapter) {
		if (typeof adapter === 'function' && !this.getAdapter(adapter) && !this.getAdapter(name)) {
			this.adapters.push({ adapter, name });
		}
	}

	/**
	 * Remove the given adapter or the first registered adapter with the given name from the list of
	 * registered adapters.
	 *
	 * @param {string | Adapter} adapter The adapter itself or the name of an adapter.
	 */
	removeAdapter(adapter) {
		const resolvedAdapter = typeof adapter === 'string' ? this.getAdapter(adapter) : adapter;
		if (resolvedAdapter) {
			const index = this.adapters.findIndex((item) => item.adapter === resolvedAdapter);
			if (index >= 0) {
				this.adapters.splice(index, 1);
			}
		}
	}

	/**
	 * Runs all registered adapters in the order they were registered using
	 * the given arguments. The result of the first adapter that returns a
	 * string will be returned and iteration will be stopped.
	 *
	 * @param {Parameters<Adapter>} args
	 */
	runAdapters(...args) {
		for (const adapter of this.adapters) {
			const data = adapter.adapter(...args);
			if (data !== null) {
				return data;
			}
		}
		return null;
	}

	/**
	 * Highlights all `pre` elements under the given container with a `data-jsonp` attribute by requesting the
	 * specified JSON and using the specified adapter or a registered adapter to extract the code to highlight
	 * from the response. The highlighted code will be inserted into the `pre` element.
	 *
	 * Note: Elements which are already loaded or currently loading will not be touched by this method.
	 *
	 * @param {Element | Document} [container=document]
	 */
	highlight(container = document) {
		const elements = container.querySelectorAll(SELECTOR);

		for (const element of elements) {
			this.Prism.highlightElement(element);
		}
	}
}


export default /** @type {import("../../types").PluginProto<'jsonp-highlight'>} */ ({
	id: 'jsonp-highlight',
	plugin(Prism) {
		const config = new JsonpHighlight(Prism);

		config.registerAdapter('github', (rsp) => {
			if (rsp && rsp.meta && rsp.data) {
				if (rsp.meta.status && rsp.meta.status >= 400) {
					return 'Error: ' + (rsp.data.message || rsp.meta.status);
				} else if (typeof (rsp.data.content) === 'string') {
					return typeof (atob) === 'function'
						? atob(rsp.data.content.replace(/\s/g, ''))
						: 'Your browser cannot decode base64';
				}
			}
			return null;
		});
		config.registerAdapter('gist', (rsp, el) => {
			if (rsp && rsp.meta && rsp.data && rsp.data.files) {
				if (rsp.meta.status && rsp.meta.status >= 400) {
					return 'Error: ' + (rsp.data.message || rsp.meta.status);
				}

				const files = rsp.data.files;
				let filename = el.getAttribute('data-filename');
				if (filename == null) {
					// Maybe in the future we can somehow render all files
					// But the standard <script> include for gists does that nicely already,
					// so that might be getting beyond the scope of this plugin
					for (const key in files) {
						if (files.hasOwnProperty(key)) {
							filename = key;
							break;
						}
					}
				}

				if (filename && files[filename] !== undefined) {
					return files[filename].content;
				}
				return 'Error: unknown or missing gist file ' + filename;
			}
			return null;
		});
		config.registerAdapter('bitbucket', (rsp) => {
			if (rsp && rsp.node && typeof (rsp.data) === 'string') {
				return rsp.data;
			}
			return null;
		});

		return config;
	},
	effect(Prism) {
		const config = /** @type {JsonpHighlight} */ (Prism.plugins.jsonpHighlight);


		const LOADING_MESSAGE = 'Loading…';
		/** @param {string} name */
		const MISSING_ADAPTER_MESSAGE = (name) => {
			return '✖ Error: JSONP adapter function "' + name + '" doesn\'t exist';
		};
		/** @param {string} url */
		const TIMEOUT_MESSAGE = (url) => {
			return '✖ Error: Timeout loading ' + url;
		};
		const UNKNOWN_FAILURE_MESSAGE = '✖ Error: Cannot parse response (perhaps you need an adapter function?)';

		return addHooks(Prism.hooks, {
			'before-highlightall': (env) => {
				env.selector += ', ' + SELECTOR;
			},
			'before-sanity-check': (env) => {
				const pre = /** @type {HTMLPreElement} */ (env.element);
				if (!pre.matches(SELECTOR)) {
					return;
				}

				const src = pre.getAttribute('data-jsonp');
				if (!src) {
					return;
				}

				env.code = ''; // fast-path the whole thing and go to complete

				// mark as loading
				pre.setAttribute(STATUS_ATTR, STATUS_LOADING);

				// add code element with loading message
				const code = pre.appendChild(document.createElement('CODE'));
				code.textContent = LOADING_MESSAGE;

				// set language
				const language = env.language;
				code.className = 'language-' + language;

				// preload the language
				const autoloader = Prism.plugins.autoloader;
				if (autoloader) {
					autoloader.loadLanguages(language);
				}

				const adapterName = pre.getAttribute('data-adapter');
				/** @type {Adapter | null} */
				let adapter = null;
				if (adapterName) {
					if (typeof window[adapterName] === 'function') {
						adapter = window[adapterName];
					} else {
						// mark as failed
						pre.setAttribute(STATUS_ATTR, STATUS_FAILED);

						code.textContent = MISSING_ADAPTER_MESSAGE(adapterName);
						return;
					}
				}

				jsonp(
					src,
					pre.getAttribute('data-callback'),
					config.timeout,
					(response) => {
						// interpret the received data using the adapter(s)
						let data;
						if (adapter) {
							data = adapter(response, pre);
						} else {
							data = config.runAdapters(response, pre);
						}

						if (data === null) {
							// mark as failed
							pre.setAttribute(STATUS_ATTR, STATUS_FAILED);

							code.textContent = UNKNOWN_FAILURE_MESSAGE;
						} else {
							// mark as loaded
							pre.setAttribute(STATUS_ATTR, STATUS_LOADED);

							code.textContent = data;
							Prism.highlightElement(code);
						}
					},
					() => {
						// mark as failed
						pre.setAttribute(STATUS_ATTR, STATUS_FAILED);

						code.textContent = TIMEOUT_MESSAGE(src);
					}
				);
			}
		});
	}
});
