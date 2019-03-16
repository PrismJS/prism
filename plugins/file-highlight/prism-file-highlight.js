(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	var NEW_LINE = /\r\n?|\n/g;
	var LANG = /\blang(?:uage)?-([\w-]+)\b/i;

	var EXTENSIONS = {
		'js': 'javascript',
		'py': 'python',
		'rb': 'ruby',
		'ps1': 'powershell',
		'psm1': 'powershell',
		'sh': 'bash',
		'bat': 'batch',
		'h': 'c',
		'tex': 'latex'
	};


	/**
	 * @typedef LoadResult
	 * @property {string} source The URL or relative path of the loaded file.
	 * @property {string} text The text of the file loaded or an error message.
	 * @property {boolean} failed Whether an error occurred during loading.
	 */

	/**
	 * Loads the given file.
	 *
	 * @param {string} src The URL or path of the source file to load.
	 * @param {(result: Readonly<LoadResult>) => void} cb A callback function to process the response.
	 */
	function loadFile(src, cb) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', src, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				/** @type {LoadResult} */
				var result = {
					source: src,
					text: '',
					failed: false
				};

				if (xhr.status < 400 && xhr.responseText) {
					result.text = xhr.responseText;
				} else {
					result.failed = true;
					if (xhr.status >= 400) {
						result.text = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
					} else {
						result.text = '✖ Error: File does not exist or is empty';
					}
				}

				return cb(result);
			}
		};
		xhr.send(null);
	}

	/**
	 * Inserts the text content of a loaded file into the given `pre` and highlights the code.
	 *
	 * @param {HTMLPreElement} pre
	 * @param {Readonly<LoadResult>} result
	 */
	function processElement(pre, result) {
		// check <pre> for a language-xxxx class
		var language = (LANG.exec(pre.className) || [, ''])[1];

		// no language found -> use the file extension
		if (!language) {
			var extension = (result.source.match(/\.(\w+)$/) || [, ''])[1];
			language = EXTENSIONS[extension] || extension;
		}

		var text = result.text;

		var range = pre.getAttribute('data-range');
		if (!result.failed && range) {
			var parts = range.split(',', 2);
			var start = parseInt(parts[0], 10);
			var end;
			if (parts[1] === undefined) {
				// e.g. data-range="2"
				end = start;
			} else if (parts[1] === '') {
				// e.g. data-range="2,"
				end = -1;
			} else {
				// e.g. data-range="1,5"
				end = parseInt(parts[1], 10);
			}

			// only if both are valid
			if (!isNaN(start) && !isNaN(end)) {
				var lines = text.split(NEW_LINE);

				if (start > 0) {
					start--;
				} else if (start < 0) {
					start += lines.length; // slice can handle negatives but data-start cannot.
				}
				if (end === -1) {
					end = lines.length;
				} else if (end < 0) {
					end++;
				}

				text = lines.slice(start, end).join('\n');

				// add data-start for line numbers
				if (!pre.hasAttribute('data-start')) {
					pre.setAttribute('data-start', String(start + 1));
				}
			}
		}

		// create <code class="language-xxxx">
		var code = document.createElement('code');
		code.className = 'language-' + language;
		code.textContent = text;

		// set <pre> class
		pre.className = pre.className.replace(LANG, ' ').replace(/\s+/g, ' ') + ' language-' + language;

		// empty <pre> and append <code>
		while (pre.firstChild) {
			pre.removeChild(pre.firstChild);
		}
		pre.appendChild(code);

		if (!result.failed) {
			// highlight <code>
			Prism.highlightElement(code);
		}

		// mark as loaded
		pre.setAttribute('data-src-loaded', '');
	}

	/**
	 * @param {ParentNode} [container=document]
	 */
	Prism.fileHighlight = function (container) {
		container = container || document;
		var preElements = Array.prototype.slice.call(container.querySelectorAll('pre[data-src]'));

		/**
		 * A map from file source to `pre` elements with that source.
		 *
		 * This is to make only one request per file.
		 *
		 * @type {Object<string, HTMLPreElement[]>}
		 */
		var map = {};
		preElements.forEach(function (pre) {
			// ignore if already loaded
			if (pre.hasAttribute('data-src-loaded')) {
				return;
			}

			pre.textContent = 'Loading…';

			var src = pre.getAttribute('data-src');
			(map[src] = map[src] || []).push(pre);
		});

		Object.keys(map).forEach(function (src) {
			loadFile(src, function (result) {
				map[src].forEach(function (pre) {
					processElement(pre, result);
				});
			});
		});

		// download toolbar button
		if (Prism.plugins.toolbar) {
			Prism.plugins.toolbar.registerButton('download-file', function (env) {
				var pre = env.element.parentNode;
				if (!pre || !/pre/i.test(pre.nodeName) || !pre.hasAttribute('data-src') || !pre.hasAttribute('data-download-link')) {
					return;
				}
				var src = pre.getAttribute('data-src');
				var a = document.createElement('a');
				a.textContent = pre.getAttribute('data-download-link-label') || 'Download';
				a.setAttribute('download', '');
				a.href = src;
				return a;
			});
		}
	};

	if (document.readyState === 'loading') {
		// Loading hasn't finished yet
		document.addEventListener('DOMContentLoaded', function () { Prism.fileHighlight(); });
	} else {
		Prism.fileHighlight();
	}
})();