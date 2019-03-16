(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}
	/**
	 * @param  {String} src - URL or path of source file to load
	 * @param  {Function} cb - callback function to process the re constructed response
	 */
	function loadFile(src, cb) {
		var xhr = new XMLHttpRequest();
		var s = [src];
		xhr.open("GET", src, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status < 400 && xhr.responseText) {
					s[1] = xhr.responseText.split('\n')
				} else if (xhr.status >= 400) {
					s[1] = "✖ Error " + xhr.status + " while fetching file: " + xhr.statusText
					s[3] = "ERROR"
				} else {
					s[1] = "✖ Error: File does not exist or is empty"
					s[3] = "ERROR"
				}
				return cb(s)
			}
		}
		xhr.send(null);
	}
	/**
	 * @param  {Element} pre - expects a DOM element - in this case a pre 
	 * @param  {Array} s - an array containing the file name from data-src and the text of the source split by newline [filename, filetext]
	 */
	function splitLines(pre, s) {
		var Extensions = {
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
		var language, lineNumbers, parent = pre;
		var lang = /\blang(?:uage)?-([\w-]+)\b/i;
		var lineNumbersTest = /\bline-numbers\b/i;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}
		if (parent) {
			language = (pre.className.match(lang) || [, ''])[1];
			lineNumbers = lineNumbersTest.test(pre.className);
		}
		if (!language) {
			var extension = (s[0].match(/\.(\w+)$/) || [, ''])[1];
			language = Extensions[extension] || extension;
		}
		// if there is no data-range, set it to show all
		!pre.getAttribute('data-range') ? pre.setAttribute('data-range', "1,-1") : null;
		// save the data-range string
		var lineRange = pre.getAttribute('data-range');
		// split it in to an array
		var rawLines = lineRange.split(',');
		// if the range is a single line, the array will contain an NaN element from the split(), this removes it
		var lines = rawLines.filter(function (x) {
			return isNaN(x) === false;
		});
		// integer value of the startLine
		var startLine = parseInt(lines[0], 10);
		// if no endLine value is provided, make it -1, which is the end of the file, otherwise, use the integer value provided
		var endLine = lines[1] === undefined ? -1 : parseInt(lines[1], 10);
		// if the element has a data-start, dont do anything, if it doesn't and we are using line-numbers, add it
		!pre.getAttribute('data-start') && lineNumbers ? pre.setAttribute('data-start', startLine) : null;
		// the code text is in s[1] 
		var codeRange = s[1];
		// make the code element
		var code = document.createElement('code');
		// add the language class from the auto-identifier
		code.classList = 'language-' + language;
		// are we using line numbers? add that class to code element
		lineNumbers ? code.classList += ' line-numbers' : null;
		// empty the pre and append the code
		pre.textContent = '';
		pre.appendChild(code);
		// s[3] is only present in the array upon XHR error, check for it, if it's not there, slice/join the code array
		if (!s[3]) {
			codeRange = codeRange.slice(startLine - 1, endLine).join('\n');
		}
		// put the joined code/error message in the code element
		code.textContent = codeRange;
		// Priiizzzzaammmm...
		Prism.highlightAllUnder(pre);
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
	}

	/**
	 * @param {Element} [container=document]
	 */
	self.Prism.fileHighlight = function (container) {
		container = container || document;
		var preElements = Array.prototype.slice.call(container.querySelectorAll('pre[data-src]'));
		var fileArray = preElements.map(function (el) {
			return el.getAttribute('data-src');
		});
		var filteredFileArray = fileArray.filter(function (el, pos) {
			return fileArray.indexOf(el) == pos;
		});
		filteredFileArray.map(function (src) {
			loadFile(src, function (s) {
				preElements.map(function (el) {
					el.getAttribute('data-src') === s[0] ? splitLines(el, s) : null;
				});
			});
		});
		
	};
	if (document.readyState === 'loading') { // Loading hasn't finished yet
		document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight());
	} else {
		// execute inside handler, for dropping Event as argument
		self.Prism.fileHighlight();
	}
})();