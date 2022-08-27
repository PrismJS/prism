import { noop } from '../../shared/util.js';

export default /** @type {import("../../types").PluginProto} */ ({
	id: 'jsonp-highlight',
	plugin(Prism) {
		return {}; // TODO:
	},
	effect(Prism) {
		if (typeof document === undefined) {
			return noop;
		}

		/**
		 * @callback Adapter
		 * @param {any} response
		 * @param {HTMLPreElement} [pre]
		 * @returns {string | null}
		 */

		/**
		 * The list of adapter which will be used if `data-adapter` is not specified.
		 *
		 * @type {Array<{adapter: Adapter, name: string}>}
		 */
		const adapters = [];

		/**
		 * Adds a new function to the list of adapters.
		 *
		 * If the given adapter is already registered or not a function or there is an adapter with the given name already,
		 * nothing will happen.
		 *
		 * @param {Adapter} adapter The adapter to be registered.
		 * @param {string} [name] The name of the adapter. Defaults to the function name of `adapter`.
		 */
		function registerAdapter(adapter, name) {
			name = name || adapter.name;
			if (typeof adapter === 'function' && !getAdapter(adapter) && !getAdapter(name)) {
				adapters.push({ adapter, name });
			}
		}
		/**
		 * Returns the given adapter itself, if registered, or a registered adapter with the given name.
		 *
		 * If no fitting adapter is registered, `null` will be returned.
		 *
		 * @param {string|Function} adapter The adapter itself or the name of an adapter.
		 * @returns {Adapter} A registered adapter or `null`.
		 */
		function getAdapter(adapter) {
			if (typeof adapter === 'function') {
				for (var i = 0, item; (item = adapters[i++]);) {
					if (item.adapter.valueOf() === adapter.valueOf()) {
						return item.adapter;
					}
				}
			} else if (typeof adapter === 'string') {
				// eslint-disable-next-line no-redeclare
				for (var i = 0, item; (item = adapters[i++]);) {
					if (item.name === adapter) {
						return item.adapter;
					}
				}
			}
			return null;
		}
		/**
		 * Remove the given adapter or the first registered adapter with the given name from the list of
		 * registered adapters.
		 *
		 * @param {string|Function} adapter The adapter itself or the name of an adapter.
		 */
		function removeAdapter(adapter) {
			if (typeof adapter === 'string') {
				adapter = getAdapter(adapter);
			}
			if (typeof adapter === 'function') {
				const index = adapters.findIndex((item) => {
					return item.adapter === adapter;
				});
				if (index >= 0) {
					adapters.splice(index, 1);
				}
			}
		}

		registerAdapter((rsp) => {
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
		}, 'github');
		registerAdapter((rsp, el) => {
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

				if (files[filename] !== undefined) {
					return files[filename].content;
				}
				return 'Error: unknown or missing gist file ' + filename;
			}
			return null;
		}, 'gist');
		registerAdapter((rsp) => {
			if (rsp && rsp.node && typeof (rsp.data) === 'string') {
				return rsp.data;
			}
			return null;
		}, 'bitbucket');


		let jsonpCallbackCounter = 0;
		/**
		 * Makes a JSONP request.
		 *
		 * @param {string} src The URL of the resource to request.
		 * @param {string | undefined | null} callbackParameter The name of the callback parameter. If falsy, `"callback"`
		 * will be used.
		 * @param {(data: unknown) => void} onSuccess
		 * @param {(reason: "timeout" | "network") => void} onError
		 * @returns {void}
		 */
		function jsonp(src, callbackParameter, onSuccess, onError) {
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
			}, Prism.plugins.jsonphighlight.timeout);

			function cleanup() {
				clearTimeout(timeoutId);
				document.head.removeChild(script);
				delete window[callbackName];
			}

			// the JSONP callback function
			window[callbackName] = function (response) {
				cleanup();
				onSuccess(response);
			};

			document.head.appendChild(script);
		}

		const LOADING_MESSAGE = 'Loading…';
		const MISSING_ADAPTER_MESSAGE = function (name) {
			return '✖ Error: JSONP adapter function "' + name + '" doesn\'t exist';
		};
		const TIMEOUT_MESSAGE = function (url) {
			return '✖ Error: Timeout loading ' + url;
		};
		const UNKNOWN_FAILURE_MESSAGE = '✖ Error: Cannot parse response (perhaps you need an adapter function?)';

		const STATUS_ATTR = 'data-jsonp-status';
		const STATUS_LOADING = 'loading';
		const STATUS_LOADED = 'loaded';
		const STATUS_FAILED = 'failed';

		const SELECTOR = 'pre[data-jsonp]:not([' + STATUS_ATTR + '="' + STATUS_LOADED + '"])'
				+ ':not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';


		Prism.hooks.add('before-highlightall', (env) => {
			env.selector += ', ' + SELECTOR;
		});

		Prism.hooks.add('before-sanity-check', (env) => {
			const pre = /** @type {HTMLPreElement} */ (env.element);
			if (pre.matches(SELECTOR)) {
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

				const src = pre.getAttribute('data-jsonp');

				jsonp(
					src,
					pre.getAttribute('data-callback'),
					(response) => {
						// interpret the received data using the adapter(s)
						let data = null;
						if (adapter) {
							data = adapter(response, pre);
						} else {
							for (let i = 0, l = adapters.length; i < l; i++) {
								data = adapters[i].adapter(response, pre);
								if (data !== null) {
									break;
								}
							}
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


		Prism.plugins.jsonphighlight = {
			/**
			 * The timeout after which an error message will be displayed.
			 *
			 * __Note:__ If the request succeeds after the timeout, it will still be processed and will override any
			 * displayed error messages.
			 */
			timeout: 5000,
			registerAdapter,
			removeAdapter,

			/**
			 * Highlights all `pre` elements under the given container with a `data-jsonp` attribute by requesting the
			 * specified JSON and using the specified adapter or a registered adapter to extract the code to highlight
			 * from the response. The highlighted code will be inserted into the `pre` element.
			 *
			 * Note: Elements which are already loaded or currently loading will not be touched by this method.
			 *
			 * @param {Element | Document} [container=document]
			 */
			highlight(container) {
				const elements = (container || document).querySelectorAll(SELECTOR);

				for (var i = 0, element; (element = elements[i++]);) {
					Prism.highlightElement(element);
				}
			}
		};
	}
});
