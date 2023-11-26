/// <reference lib="WebWorker"/>

const _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
			? self // if in worker
			: {}   // if in node js
	);

/**
 * Export the current environment so if users want to assign it to the global scope, they can.
 * @example
 *   import { Prism, environment } from "prism-esm"
 *   environment.Prism = Prism
 */
export const environment = _self;

/**
 * @typedef {object} PrismOptions
 * @property {boolean} [manual=true]
 * @property {boolean} [disableWorkerMessageHandler]
 */

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */
export class Prism {
	/**
	 * @param {PrismOptions} options
	 */
	constructor (options = {}) {

		// The grammar object for plaintext
		let plainTextGrammar = {};

		const {
			disableWorkerMessageHandler,
			manual
		} = options

		this.manual = manual

		if (this.manual == null) {
			this.manual = false
		}

		this.plugins = {}

		const _ = this
		/**
		 * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
		 * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
		 * own worker, you don't want it to do this.
		 *
		 * By setting this value to `true`, Prism will not add its own listeners to the worker.
		 *
		 * You obviously have to change this value before Prism executes. To do this, you can add an
		 * empty Prism object into the global scope before loading the Prism script like this:
		 *
		 * ```js
		 * window.Prism = window.Prism || {};
		 * Prism.disableWorkerMessageHandler = true;
		 * // Load Prism's script
		 * ```
		 *
		 * @default false
		 * @type {boolean}
		 * @public
		 */
		this.disableWorkerMessageHandler = Boolean(disableWorkerMessageHandler)

		this.Token = Token
		this.util = new Util(this)
		const util = this.util

		/**
		 * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
		 */
		this.languages = {
			/**
			 * The grammar for plain, unformatted text.
			 */
			plain: plainTextGrammar,
			plaintext: plainTextGrammar,
			text: plainTextGrammar,
			txt: plainTextGrammar,

			/**
			 * Creates a deep copy of the language with the given id and appends the given tokens.
			 *
			 * If a token in `redef` also appears in the copied language, then the existing token in the copied language
			 * will be overwritten at its original position.
			 *
			 * ## Best practices
			 *
			 * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
			 * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
			 * understand the language definition because, normally, the order of tokens matters in Prism grammars.
			 *
			 * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
			 * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
			 *
			 * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
			 * @param {Grammar} redef The new tokens to append.
			 * @returns {Grammar} The new language created.
			 * @public
			 * @example
			 * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
			 *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
			 *     // at its original position
			 *     'comment': { ... },
			 *     // CSS doesn't have a 'color' token, so this token will be appended
			 *     'color': /\b(?:red|green|blue)\b/
			 * });
			 */
			extend: (id, redef) => {
				let lang = this.util.clone(this.languages[id])
				// let lang = this.languages[id]

				for (var key in redef) {
					lang[key] = redef[key];
				}

				return lang;
			},

			/**
			 * Inserts tokens _before_ another token in a language definition or any other grammar.
			 *
			 * ## Usage
			 *
			 * This helper method makes it easy to modify existing languages. For example, the CSS language definition
			 * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
			 * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
			 * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
			 * this:
			 *
			 * ```js
			 * Prism.languages.markup.style = {
			 *     // token
			 * };
			 * ```
			 *
			 * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
			 * before existing tokens. For the CSS example above, you would use it like this:
			 *
			 * ```js
			 * Prism.languages.insertBefore('markup', 'cdata', {
			 *     'style': {
			 *         // token
			 *     }
			 * });
			 * ```
			 *
			 * ## Special cases
			 *
			 * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
			 * will be ignored.
			 *
			 * This behavior can be used to insert tokens after `before`:
			 *
			 * ```js
			 * Prism.languages.insertBefore('markup', 'comment', {
			 *     'comment': Prism.languages.markup.comment,
			 *     // tokens after 'comment'
			 * });
			 * ```
			 *
			 * ## Limitations
			 *
			 * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
			 * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
			 * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
			 * deleting properties which is necessary to insert at arbitrary positions.
			 *
			 * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
			 * Instead, it will create a new object and replace all references to the target object with the new one. This
			 * can be done without temporarily deleting properties, so the iteration order is well-defined.
			 *
			 * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
			 * you hold the target object in a variable, then the value of the variable will not change.
			 *
			 * ```js
			 * var oldMarkup = Prism.languages.markup;
			 * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
			 *
			 * assert(oldMarkup !== Prism.languages.markup);
			 * assert(newMarkup === Prism.languages.markup);
			 * ```
			 *
			 * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
			 * object to be modified.
			 * @param {string} before The key to insert before.
			 * @param {Grammar} insert An object containing the key-value pairs to be inserted.
			 * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
			 * object to be modified.
			 *
			 * Defaults to `Prism.languages`.
			 * @returns {Grammar} The new grammar object.
			 * @public
			 */
			insertBefore: (inside, before, insert, root) => {
				if (!root) {
					root = /** @type {Record<string, unknown>} */ (this.languages);
				}

				let grammar = root[inside];

				/** @type {Grammar} */
				let ret = {};

				for (let token in grammar) {
					if (grammar.hasOwnProperty(token)) {

						if (token == before) {
							for (var newToken in insert) {
								if (insert.hasOwnProperty(newToken)) {
									ret[newToken] = insert[newToken];
								}
							}
						}

						// Do not insert token which also occur in insert. See #1525
						if (!insert.hasOwnProperty(token)) {
							ret[token] = grammar[token];
						}
					}
				}

				var old = root[inside];
				root[inside] = ret;

				// Update references in other language definitions
				this.languages.DFS(this.languages, function (key, value) {
					if (value === old && key != inside) {
						this[key] = ret;
					}
				});

				return ret;
			},

			// Traverse a language definition with Depth First Search
			DFS (o, callback, type, visited) {
				visited = visited || {};

				var objId = util.objId;

				for (var i in o) {
					if (o.hasOwnProperty(i)) {
						callback.call(o, i, o[i], type || i);

						var property = o[i];
						var propertyType = util.type(property);

						if (propertyType === 'Object' && !visited[objId(property)]) {
							visited[objId(property)] = true;
							this.DFS(property, callback, null, visited);
						} else if (propertyType === 'Array' && !visited[objId(property)]) {
							visited[objId(property)] = true;
							this.DFS(property, callback, i, visited);
						}
					}
				}
			}
		}

		/**
		 * @public
		 */
		this.hooks = {
			all: {},

			/**
			 * Adds the given callback to the list of callbacks for the given hook.
			 *
			 * The callback will be invoked when the hook it is registered for is run.
			 * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
			 *
			 * One callback function can be registered to multiple hooks and the same hook multiple times.
			 *
			 * @param {string} name The name of the hook.
			 * @param {HookCallback} callback The callback function which is given environment variables.
			 * @public
			 */
			add: function (name, callback) {
				var hooks = _.hooks.all;

				hooks[name] = hooks[name] || [];

				hooks[name].push(callback);
			},

			/**
			 * Runs a hook invoking all registered callbacks with the given environment variables.
			 *
			 * Callbacks will be invoked synchronously and in the order in which they were registered.
			 *
			 * @param {string} name The name of the hook.
			 * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
			 * @public
			 */
			run: function (name, env) {
				var callbacks = _.hooks.all[name];

				if (!callbacks || !callbacks.length) {
					return;
				}

				for (var i = 0, callback; (callback = callbacks[i++]);) {
					callback(env);
				}
			}
		}


		if (!environment.document) {
			if (!environment.addEventListener) {
				// in Node.js
				return _;
			}

			if (!_.disableWorkerMessageHandler) {
				// In worker
				environment.addEventListener('message', function (evt) {
					var message = JSON.parse(evt.data);
					var lang = message.language;
					var code = message.code;
					var immediateClose = message.immediateClose;

					environment.postMessage(_.highlight(code, _.languages[lang], lang));
					if (immediateClose) {
						_self.close();
					}
				}, false);
			}

			return _;
		}


		function highlightAutomaticallyCallback() {
			if (!_.manual) {
				_.highlightAll();
			}
		}

		if (!_.manual) {
			// If the document state is "loading", then we'll use DOMContentLoaded.
			// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
			// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
			// might take longer one animation frame to execute which can create a race condition where only some plugins have
			// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
			// See https://github.com/PrismJS/prism/issues/2102
			var readyState = document.readyState;
			if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
				document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
			} else {
				if (window.requestAnimationFrame) {
					window.requestAnimationFrame(highlightAutomaticallyCallback);
				} else {
					window.setTimeout(highlightAutomaticallyCallback, 16);
				}
			}
		}
	}

	/**
	* This is the most high-level function in Prism’s API.
	* It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
	* each one of them.
	*
	* This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
	*
	* @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
	* @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
	* @memberof Prism
	* @public
	*/
	highlightAll (async, callback) {
		this.highlightAllUnder(document, async, callback);
	}

	/**
		* Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
		* {@link Prism.highlightElement} on each one of them.
		*
		* The following hooks will be run:
		* 1. `before-highlightall`
		* 2. `before-all-elements-highlight`
		* 3. All hooks of {@link Prism.highlightElement} for each element.
		*
		* @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
		* @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
		* @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
		* @memberof Prism
		* @public
		*/
	highlightAllUnder (container, async, callback) {
		var env = {
			callback: callback,
			container: container,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		this.hooks.run('before-highlightall', env);

		env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

		this.hooks.run('before-all-elements-highlight', env);

		for (var i = 0, element; (element = env.elements[i++]);) {
			this.highlightElement(element, async === true, env.callback);
		}
	}

	/**
	* Highlights the code inside a single element.
	*
	* The following hooks will be run:
	* 1. `before-sanity-check`
	* 2. `before-highlight`
	* 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
	* 4. `before-insert`
	* 5. `after-highlight`
	* 6. `complete`
	*
	* Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
	* the element's language.
	*
	* @param {Element} element The element containing the code.
	* It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
	* @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
	* to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
	* [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
	*
	* Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
	* asynchronous highlighting to work. You can build your own bundle on the
	* [Download page](https://prismjs.com/download.html).
	* @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
	* Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
	* @public
	*/
	highlightElement (element, async, callback) {
		// Find language
		var language = this.util.getLanguage(element);
		var grammar = this.languages[language];

		// Set language on the element, if not present
		this.util.setLanguage(element, language);

		// Set language on the parent, for styling
		var parent = element.parentElement;
		if (parent && parent.nodeName.toLowerCase() === 'pre') {
			this.util.setLanguage(parent, language);
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		const insertHighlightedCode = (highlightedCode) => {
			env.highlightedCode = highlightedCode;

			this.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			this.hooks.run('after-highlight', env);
			this.hooks.run('complete', env);
			callback && callback.call(env.element);
		}

		this.hooks.run('before-sanity-check', env);

		// plugins may change/add the parent/element
		parent = env.element.parentElement;
		if (parent && parent.nodeName.toLowerCase() === 'pre' && !parent.hasAttribute('tabindex')) {
			parent.setAttribute('tabindex', '0');
		}

		if (!env.code) {
			this.hooks.run('complete', env);
			callback && callback.call(env.element);
			return;
		}

		this.hooks.run('before-highlight', env);

		if (!env.grammar) {
			insertHighlightedCode(this.util.encode(env.code));
			return;
		}

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function (evt) {
				insertHighlightedCode(evt.data);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		} else {
			insertHighlightedCode(this.highlight(env.code, env.grammar, env.language));
		}
	}

	/**
		* Low-level function, only use if you know what you’re doing. It accepts a string of text as input
		* and the language definitions to use, and returns a string with the HTML produced.
		*
		* The following hooks will be run:
		* 1. `before-tokenize`
		* 2. `after-tokenize`
		* 3. `wrap`: On each {@link Token}.
		*
		* @param {string} text A string with the code to be highlighted.
		* @param {Grammar} grammar An object containing the tokens to use.
		*
		* Usually a language definition like `Prism.languages.markup`.
		* @param {string} language The name of the language definition passed to `grammar`.
		* @returns {string} The highlighted HTML.
		* @memberof Prism
		* @public
		* @example
		* Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
		*/
	highlight (text, grammar, language) {
		var env = {
			code: text,
			grammar: grammar,
			language: language
		};
		this.hooks.run('before-tokenize', env);
		if (!env.grammar) {
			throw new Error('The language "' + env.language + '" has no grammar.');
		}
		env.tokens = this.tokenize(env.code, env.grammar);
		this.hooks.run('after-tokenize', env);
		return Token.stringify(this.util.encode(env.tokens), env.language, this);
	}

	/**
		* This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
		* and the language definitions to use, and returns an array with the tokenized code.
		*
		* When the language definition includes nested tokens, the function is called recursively on each of these tokens.
		*
		* This method could be useful in other contexts as well, as a very crude parser.
		*
		* @param {string} text A string with the code to be highlighted.
		* @param {Grammar} grammar An object containing the tokens to use.
		*
		* Usually a language definition like `Prism.languages.markup`.
		* @returns {TokenStream} An array of strings and tokens, a token stream.
		* @memberof Prism
		* @public
		* @example
		* let code = `var foo = 0;`;
		* let tokens = Prism.tokenize(code, Prism.languages.javascript);
		* tokens.forEach(token => {
		*     if (token instanceof Prism.Token && token.type === 'number') {
		*         console.log(`Found numeric literal: ${token.content}`);
		*     }
		* });
		*/
	tokenize (text, grammar) {
		var rest = grammar?.rest;
		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		var tokenList = new LinkedList();
		addAfter(tokenList, tokenList.head, text);

		matchGrammar(text, tokenList, grammar, tokenList.head, 0, this);

		return toArray(tokenList);
	}
}


/**
* Creates a new token.
* @class
* @public
*/
export class Token {
	/**
	* @param {string} type See {@link Token#type type}
	* @param {string | TokenStream} content See {@link Token#content content}
	* @param {string|string[]} [alias] The alias(es) of the token.
	* @param {string} [matchedStr=""] A copy of the full string this token was created from.
 	*/
	constructor (type, content, alias, matchedStr) {
	/**
		* The type of the token.
		*
		* This is usually the key of a pattern in a {@link Grammar}.
		*
		* @type {string}
		* @see GrammarToken
		* @public
		*/
	this.type = type;
	/**
		* The strings or tokens contained by this token.
		*
		* This will be a token stream if the pattern matched also defined an `inside` grammar.
		*
		* @type {string | TokenStream}
		* @public
		*/
	this.content = content;
	/**
		* The alias(es) of the token.
		*
		* @type {string|string[]}
		* @see GrammarToken
		* @public
		*/
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || '').length | 0;
	}

	/**
	* Converts the given token or token stream to an HTML representation.
	*
	* The following hooks will be run:
	* 1. `wrap`: On each {@link Token}.
	*
	* @param {string | Token | TokenStream} o The token or token stream to be converted.
	* @param {string} language The name of current language.
	* @param {Prism} prism - The instance of prism to use for "wrap" hooks
	* @returns {string} The HTML representation of the token or token stream.
	* @memberof Token
	* @static
	*/
	static stringify(o, language, prism) {
		const _ = this
		if (typeof o == 'string') {
			return o;
		}
		if (Array.isArray(o)) {
			var s = '';
			o.forEach(function (e) {
				s += _.stringify(e, language, prism);
			});
			return s;
		}

		var env = {
			type: o.type,
			content: _.stringify(o.content, language, prism),
			tag: 'span',
			classes: ['token', o.type],
			attributes: {},
			language: language
		};

		var aliases = o.alias;
		if (aliases) {
			if (Array.isArray(aliases)) {
				Array.prototype.push.apply(env.classes, aliases);
			} else {
				env.classes.push(aliases);
			}
		}

		prism.hooks.run('wrap', env);

		var attributes = '';
		for (var name in env.attributes) {
			attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
		}

		return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
	};
}


// Private helper vars
let lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
let uniqueId = 0;

/**
* A namespace for utility methods.
*
* All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
* change or disappear at any time.
*
*/
class Util {
	/**
	 * @param {Prism} prism
	 */
	constructor (prism) {
		this.prism = prism
	}
	/**
	 * @template {Token | Token[] | string} T
	 * @param {T} tokens
	 * @return {T}
	 */
	encode = (tokens) => {
		if (tokens instanceof Token) {
			return new Token(tokens.type, this.encode(tokens.content), tokens.alias, this.prism);
		} else if (Array.isArray(tokens)) {
			return tokens.map(this.encode);
		} else {
			return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
		}
	}

	/**
		* Returns the name of the type of the given value.
		*
		* @param {any} o
		* @returns {string}
		* @example
		* type(null)      === 'Null'
		* type(undefined) === 'Undefined'
		* type(123)       === 'Number'
		* type('foo')     === 'String'
		* type(true)      === 'Boolean'
		* type([1, 2])    === 'Array'
		* type({})        === 'Object'
		* type(String)    === 'Function'
		* type(/abc+/)    === 'RegExp'
		*/
	type (o) {
		return Object.prototype.toString.call(o).slice(8, -1);
	}

	/**
	* Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
	*
	* If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
	*
	* @param {Element} element
	* @returns {string}
	*/
	getLanguage (element) {
		while (element) {
			var m = lang.exec(element.className);
			if (m) {
				return m[1].toLowerCase();
			}
			element = element.parentElement;
		}
		return 'none';
	}

	/**
	* Sets the Prism `language-xxxx` class of the given element.
	*
	* @param {Element} element
	* @param {string} language
	* @returns {void}
	*/
	setLanguage (element, language) {
		// remove all `language-xxxx` classes
		// (this might leave behind a leading space)
		element.className = element.className.replace(RegExp(lang, 'gi'), '');

		// add the new `language-xxxx` class
		// (using `classList` will automatically clean up spaces for us)
		element.classList.add('language-' + language);
	}

	/**
		* Returns a unique number for the given object. Later calls will still return the same number.
		*
		* @param {Object} obj
		* @returns {number}
		*/
	objId (obj) {
		if (!obj['__id']) {
			Object.defineProperty(obj, '__id', { value: ++uniqueId });
		}
		return obj['__id'];
	}

	/**
	* Creates a deep clone of the given object.
	*
	* The main intended use of this function is to clone language definitions.
	*
	* @param {T} o
	* @param {Record<number, any>} [visited]
	* @returns {T}
	* @template T
	*/
	clone (o, visited) {
		return structuredClone(o)
		visited = visited || {};

		let cloned
		let id;
		switch (this.type(o)) {
			case 'Object':
				id = this.objId(o);
				if (visited[id]) {
					return visited[id];
				}
				cloned = /** @type {Record<string, any>} */ ({});

				visited[id] = cloned;

				for (var key in o) {
					if (o.hasOwnProperty(key)) {
						cloned[key] = this.clone(o[key], visited);
					}
				}

				return /** @type {any} */ (cloned);

			case 'Array':
				id = this.objId(o);
				if (visited[id]) {
					return visited[id];
				}
				cloned = [];
				visited[id] = cloned;

				(/** @type {Array} */(/** @type {any} */(o))).forEach((v, i) => {
					cloned[i] = this.clone(v, visited);
				});

				return /** @type {any} */ (cloned);

			default:
				return o;
		}
	}

	/**
	* Returns whether a given class is active for `element`.
	*
	* The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
	* if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
	* given class is just the given class with a `no-` prefix.
	*
	* Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
	* closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
	* ancestors have the given class or the negated version of it, then the default activation will be returned.
	*
	* In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
	* version of it, the class is considered active.
	*
	* @param {Element} element
	* @param {string} className
	* @param {boolean} [defaultActivation=false]
	* @returns {boolean}
	*/
	isActive (element, className, defaultActivation) {
		var no = 'no-' + className;

		while (element) {
			var classList = element.classList;
			if (classList.contains(className)) {
				return true;
			}
			if (classList.contains(no)) {
				return false;
			}
			element = element.parentElement;
		}
		return !!defaultActivation;
	}
}

/**
	* @param {RegExp} pattern
	* @param {number} pos
	* @param {string} text
	* @param {boolean} lookbehind
	* @returns {RegExpExecArray | null}
	*/
function matchPattern(pattern, pos, text, lookbehind) {
	// TODO: this shouldn't be here, but fixes an issue with HTTP identifiers.
	if (pattern === true) {
		return null
	}

	pattern.lastIndex = pos;
	var match = pattern.exec(text);
	if (match && lookbehind && match[1]) {
		// change the match to remove the text matched by the Prism lookbehind group
		var lookbehindLength = match[1].length;
		match.index += lookbehindLength;
		match[0] = match[0].slice(lookbehindLength);
	}
	return match;
}

/**
	* @param {string} text
	* @param {LinkedList<string | Token>} tokenList
	* @param {any} grammar
	* @param {LinkedListNode<string | Token>} startNode
	* @param {number} startPos
	* @param {Prism} [prismInstance]
	* @param {RematchOptions} [rematch]
	* @returns {void}
	* @private
	*
	* @typedef RematchOptions
	* @property {string} cause
	* @property {number} reach
	*/
function matchGrammar(text, tokenList, grammar, startNode, startPos, prismInstance, rematch) {
	for (var token in grammar) {
		if (!grammar.hasOwnProperty(token) || !grammar[token]) {
			continue;
		}

		var patterns = grammar[token];
		patterns = Array.isArray(patterns) ? patterns : [patterns];

		for (var j = 0; j < patterns.length; ++j) {
			if (rematch && rematch.cause == token + ',' + j) {
				return;
			}

			var patternObj = patterns[j];
			var inside = patternObj.inside;
			var lookbehind = !!patternObj.lookbehind;
			var greedy = !!patternObj.greedy;
			var alias = patternObj.alias;

			if (greedy && !patternObj.pattern.global) {
				// Without the global flag, lastIndex won't work
				var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
				patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
			}

			/** @type {RegExp} */
			var pattern = patternObj.pattern || patternObj;

			for ( // iterate the token list and keep track of the current token/string position
				var currentNode = startNode.next, pos = startPos;
				currentNode !== tokenList.tail;
				pos += currentNode.value.length, currentNode = currentNode.next
			) {

				if (rematch && pos >= rematch.reach) {
					break;
				}

				var str = currentNode.value;

				if (tokenList.length > text.length) {
					// Something went terribly wrong, ABORT, ABORT!
					return;
				}

				if (str instanceof Token) {
					continue;
				}

				var removeCount = 1; // this is the to parameter of removeBetween
				var match;

				if (greedy) {
					match = matchPattern(pattern, pos, text, lookbehind);
					if (!match || match.index >= text.length) {
						break;
					}

					var from = match.index;
					var to = match.index + match[0].length;
					var p = pos;

					// find the node that contains the match
					p += currentNode.value.length;
					while (from >= p) {
						currentNode = currentNode.next;
						p += currentNode.value.length;
					}
					// adjust pos (and p)
					p -= currentNode.value.length;
					pos = p;

					// the current node is a Token, then the match starts inside another Token, which is invalid
					if (currentNode.value instanceof Token) {
						continue;
					}

					// find the last node which is affected by this match
					for (
						var k = currentNode;
						k !== tokenList.tail && (p < to || typeof k.value === 'string');
						k = k.next
					) {
						removeCount++;
						p += k.value.length;
					}
					removeCount--;

					// replace with the new match
					str = text.slice(pos, p);
					match.index -= pos;
				} else {
					match = matchPattern(pattern, 0, str, lookbehind);
					if (!match) {
						continue;
					}
				}

				// eslint-disable-next-line no-redeclare
				var from = match.index;
				var matchStr = match[0];
				var before = str.slice(0, from);
				var after = str.slice(from + matchStr.length);

				var reach = pos + str.length;
				if (rematch && reach > rematch.reach) {
					rematch.reach = reach;
				}

				var removeFrom = currentNode.prev;

				if (before) {
					removeFrom = addAfter(tokenList, removeFrom, before);
					pos += before.length;
				}

				removeRange(tokenList, removeFrom, removeCount);

				var wrapped = new Token(token, inside ? prismInstance.tokenize(matchStr, inside) : matchStr, alias, matchStr);
				currentNode = addAfter(tokenList, removeFrom, wrapped);

				if (after) {
					addAfter(tokenList, currentNode, after);
				}

				if (removeCount > 1) {
					// at least one Token object was removed, so we have to do some rematching
					// this can only happen if the current pattern is greedy

					/** @type {RematchOptions} */
					var nestedRematch = {
						cause: token + ',' + j,
						reach: reach
					};
					matchGrammar(text, tokenList, grammar, currentNode.prev, pos, prismInstance, nestedRematch);

					// the reach might have been extended because of the rematching
					if (rematch && nestedRematch.reach > rematch.reach) {
						rematch.reach = nestedRematch.reach;
					}
				}
			}
		}
	}
}

/**
	* @typedef LinkedListNode
	* @property {T} value
	* @property {LinkedListNode<T> | null} prev The previous node.
	* @property {LinkedListNode<T> | null} next The next node.
	* @template T
	* @private
	*/

/**
	* @template T
	* @private
	*/
function LinkedList() {
	/** @type {LinkedListNode<T>} */
	var head = { value: null, prev: null, next: null };
	/** @type {LinkedListNode<T>} */
	var tail = { value: null, prev: head, next: null };
	head.next = tail;

	/** @type {LinkedListNode<T>} */
	this.head = head;
	/** @type {LinkedListNode<T>} */
	this.tail = tail;
	this.length = 0;
}

/**
	* Adds a new node with the given value to the list.
	*
	* @param {LinkedList<T>} list
	* @param {LinkedListNode<T>} node
	* @param {T} value
	* @returns {LinkedListNode<T>} The added node.
	* @template T
	*/
function addAfter(list, node, value) {
	// assumes that node != list.tail && values.length >= 0
	var next = node.next;

	var newNode = { value: value, prev: node, next: next };
	node.next = newNode;
	next.prev = newNode;
	list.length++;

	return newNode;
}
/**
	* Removes `count` nodes after the given node. The given node will not be removed.
	*
	* @param {LinkedList<T>} list
	* @param {LinkedListNode<T>} node
	* @param {number} count
	* @template T
	*/
function removeRange(list, node, count) {
	var next = node.next;
	for (var i = 0; i < count && next !== list.tail; i++) {
		next = next.next;
	}
	node.next = next;
	next.prev = node;
	list.length -= i;
}
/**
	* @param {LinkedList<T>} list
	* @returns {T[]}
	* @template T
	*/
function toArray(list) {
	var array = [];
	var node = list.head.next;
	while (node !== list.tail) {
		array.push(node.value);
		node = node.next;
	}
	return array;
}



// Typescript note:
// The following can be used to import the Token type in JSDoc:
//
//   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

// some additional documentation/types

/**
 * The expansion of a simple `RegExp` literal to support additional properties.
 *
 * @typedef GrammarToken
 * @property {RegExp} pattern The regular expression of the token.
 * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
 * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
 * @property {boolean} [greedy=false] Whether the token is greedy.
 * @property {string|string[]} [alias] An optional alias or list of aliases.
 * @property {Grammar} [inside] The nested grammar of this token.
 *
 * The `inside` grammar will be used to tokenize the text value of each token of this kind.
 *
 * This can be used to make nested and even recursive language definitions.
 *
 * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
 * each another.
 * @global
 * @public
 */

/**
 * @typedef Grammar
 * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
 * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
 * @global
 * @public
 */

/**
 * A function which will invoked after an element was successfully highlighted.
 *
 * @callback HighlightCallback
 * @param {Element} element The element successfully highlighted.
 * @returns {void}
 * @global
 * @public
 */

/**
 * @callback HookCallback
 * @param {Object<string, any>} env The environment variables of the hook.
 * @returns {void}
 * @global
 * @public
 */