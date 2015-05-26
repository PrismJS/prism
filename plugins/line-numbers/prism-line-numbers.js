(function(){

	/**
	 * Class name which is used to flag this code field has break-word css attr
	 * @type {String}
	 */
	var BREAK_WORD_CLASS = 'line-numbers-break-word';

	/**
	 * Resizes line numbers spans according to height of line of code
	 * @param  {Element} element <code> element
	 */
	var _resizeElement = function(element){
		var lineNumbersWrapper = element.querySelector('.line-numbers-rows');
		var lineNumberSizer = element.querySelector('.line-numbers-sizer');
		var codeLines = element.textContent.split('\n');

		lineNumberSizer.style.display = 'block';

		codeLines.forEach(function(line, lineNumber){
			lineNumberSizer.innerText = line || '\n';
			var lineSize = lineNumberSizer.getBoundingClientRect().height;
			lineNumbersWrapper.children[lineNumber].style.height = lineSize + 'px';
		});

		lineNumberSizer.innerText = '';
		lineNumberSizer.style.display = 'none';
	};

	window.addEventListener('resize', function(){
		Array.prototype.forEach.call(document.querySelectorAll('pre.' + BREAK_WORD_CLASS), _resizeElement);
	});

	Prism.hooks.add('after-highlight', function (env) {
		// works only for <code> wrapped inside <pre> (not inline)
		var pre = env.element.parentNode;
		var clsReg = /\s*\bline-numbers\b\s*/;
		if (
			!pre || !/pre/i.test(pre.nodeName) ||
			// Abort only if nor the <pre> nor the <code> have the class
			(!clsReg.test(pre.className) && !clsReg.test(env.element.className))
		) {
			return;
		}

		if (clsReg.test(env.element.className)) {
			// Remove the class "line-numbers" from the <code>
			env.element.className = env.element.className.replace(clsReg, '');
		}
		if (!clsReg.test(pre.className)) {
			// Add the class "line-numbers" to the <pre>
			pre.className += ' line-numbers';
		}

		var linesNum = (1 + env.code.split('\n').length);
		var lineNumbersWrapper = document.createElement('span');
		lineNumbersWrapper.className = 'line-numbers-rows';

		var lines = new Array(linesNum);
		lines = lines.join('<span></span>');

		lineNumbersWrapper.innerHTML = lines;

		if (pre.hasAttribute('data-start')) {
			pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
		}

		env.element.appendChild(lineNumbersWrapper);

		if (pre.classList.contains(BREAK_WORD_CLASS)){
			var lineHeightSizer = document.createElement('span');
			lineHeightSizer.className = 'line-numbers-sizer';

			env.element.appendChild(lineHeightSizer);
			_resizeElement(env.element);
		}

	});

})();