(function () {

	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	/**
	 * Returns style declarations for the element
	 * @param {Element} element
	 */
	Prism.hooks.add('before-insert', function (env) {

		// works only for <code> wrapped inside <pre> (not inline)
		var pre = env.element.parentNode;
		if (!pre || !/pre/i.test(pre.nodeName)) {
			return;
		}

		// we are not welcome here :(
		if (pre.className.includes('nolines')) {
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

		function createLine(lineNumber, prefix) {
			var line = document.createElement('div');
			var anchor = document.createElement('a');
			if (prefix) {
				var target = prefix + '.' + lineNumber;
				line.id = target;
				anchor.href = '#' + target;
			}
			line.setAttribute('class', 'line');
			line.appendChild(anchor);
			return line;
		}

		function splitNode(node) {
			if (node.hasChildNodes()) {
				// so we've got a kid! :)
				var p1 = document.createElement(node.nodeName);
				var p2 = document.createElement(node.nodeName);
				if (node.hasAttributes()) {
					for (i = 0; i < node.attributes.length ; i++) {
						var key = node.attributes.item(i).name;
						var value = node.attributes.item(i).value;
						p1.setAttribute(key, value);
						p2.setAttribute(key, value);
					}
				}
				var kid = node.firstChild;

				// skip all non-interesting kids
				while (kid && !/\n/.test(kid.textContent)) {
					p1.appendChild(kid.cloneNode(true));
					kid = kid.nextSibling;
				}

				if (kid && /\n/.test(kid.textContent)) {
					// found a special one :)
					var pair = splitNode(kid);
					p1.appendChild(pair[0]);
					if (pair[1])
						p2.appendChild(pair[1]);
				}

				return [ p1, p2 ];
			}

			// we are at the bottom of the hierarchy
			switch (node.nodeType) {
				case Node.TEXT_NODE:
					var newLine = node.textContent.indexOf('\n');
					if (newLine == -1 || newLine == node.textContent.length - 1)
						return [ node, null ];
					return [
						document.createTextNode(node.textContent.slice(0, newLine + 1)),
						document.createTextNode(node.textContent.slice(newLine + 1))
					];
					break;
				default:
					console.warn('Lines plugin: encountered unexpected node type ', node.nodeType, ', please report this as bug.');
					return [ node, null ]; // no splitting, safe
			}
		}

		var parser = new DOMParser();
		var highlightedCode = parser.parseFromString(env.highlightedCode, 'text/html');
		var wrapped = new DocumentFragment();
		var lineNumber = dataStart;
		var line = createLine(lineNumber++, pre.id)
		var currentNode = highlightedCode.body.firstChild;

		while (currentNode) {
			// quick test for embedded lines
			if (/\n/.test(currentNode.textContent)) {
				var detached = currentNode.cloneNode(true);
				while (detached && /\n/.test(detached.textContent)) {
					var pair = splitNode(detached);
					line.appendChild(pair[0]);
					wrapped.appendChild(line);
					line = createLine(lineNumber++, pre.id);
					detached = pair[1];
				}
				if (detached)
					line.appendChild(detached);
			}
			else {
				line.appendChild(currentNode.cloneNode(true));
			}
			currentNode = currentNode.nextSibling;
		}

		// if there is an uncommited line, commit it
		if (line.children.length > 1)
			wrapped.appendChild(line);

		if (wrapped.children) {
			env.highlightedCode = '';
			for (i = 0; i < wrapped.children.length; i++)
				env.highlightedCode += wrapped.children[i].outerHTML;
		}
	});
}());
