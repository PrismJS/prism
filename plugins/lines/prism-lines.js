(function () {

	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	/**
	 * Returns style declarations for the element
	 * @param {Element} element
	 */
	Prism.hooks.add('before-insert', function (env) {
		// no grammar -> no highlighting yet
		/*
		if (!env.grammar) {
			return;
		}
		*/
		/**
		 * Returns whether the given element has the given class.
		 *
		 * @param {Element} element
		 * @param {string} className
		 * @returns {boolean}
		 */
		function hasClass(element, className) {
			className = " " + className + " ";
			return (" " + element.className + " ")
				.replace(/[\n\t]/g, " ")
				.indexOf(className) > -1
		}

		// works only for <code> wrapped inside <pre> (not inline)
		var pre = env.element.parentNode;
		if (!pre || !/pre/i.test(pre.nodeName)) {
			return;
		}

		// we are not welcome here :(
		if (hasClass(pre, 'nolines')) {
			return;
		}

		// support for line-numbers behaviour
		var dataStart = 1;
		if (pre.hasAttribute('data-start')) {
			dataStart = parseInt(pre.getAttribute('data-start'), 10);
			if (isNaN(dataStart)) {
				dataStart = 1;
			}
			pre.style.setProperty('--counter-start', dataStart - 1);
                }

		// wrap each line in <div class="line"><a></a>...</div>
		//   - we need the a tag to enable active line numbers support
		var line = dataStart;
		var fragment = pre.id ? pre.id + '.' : null;
		env.highlightedCode =
			'<div' + (fragment ? ' id="' + fragment + line + '"' : '') + ' class="line">' +
			'<a' + (fragment ? ' href="#' + fragment + line + '"' : '') + '></a>' +
			env.highlightedCode.replace(/\n/g,
				function(match, offset, string) {
					line++;
					return (match +
						'</div><div' + (fragment ? ' id="' + fragment + line + '"' : '') + ' class="line">' +
						'<a' + (fragment ? ' href="#' + fragment + line + '"' : '') + '></a>');
				}) +
			'</div>';
	});
}());
