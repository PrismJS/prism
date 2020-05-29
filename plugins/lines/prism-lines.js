// Original author: https://github.com/galaxy4public

(function () {

	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	/**
	 * Removes all child nodes of the given element and returns the removed nodes in order.
	 *
	 * @param {Element} element
	 * @returns {Node[]}
	 */
	function drainChildNodes(element) {
		/** @type {Node[]} */
		var nodes = [];

		var first;
		while (first = element.firstChild) {
			nodes.push(first);
			element.removeChild(first);
		}

		return nodes;
	}

	/**
	 * Transfers the `count` last child nodes from `from` to `to` by appending them.
	 *
	 * @param {Element} from
	 * @param {Element} to
	 * @param {number} count
	 */
	function transferLastChildNodes(from, to, count) {
		/** @type {Node[]} */
		var nodes = [];

		while (count-- !== 0) {
			nodes.push(from.removeChild(from.lastChild));
		}

		// nodes are in reversed order
		for (var i = nodes.length - 1; i >= 0; i--) {
			to.append(nodes[i]);
		}
	}

	/** @type {Readonly<SplitResult>} */
	var NO_SPLIT = {};
	/** @type {Readonly<SplitResult>} */
	var NO_SPLIT_NEWLINE = { newline: true };

	/**
	 * Modifies the given node such that its `textContent` is exactly one line.
	 *
	 * The `newline` property of the returned `SplitResult` is `true` if the given node contains a newline.
	 * The `rest` property is only defined if `newline` is `true` and, if defined, contains a node representing the
	 * rest of the text content (plus tags).
	 *
	 * If `newline` is `true` and `rest` is undefined, then the given contains exactly one line terminated by a single
	 * newline.
	 *
	 * @param {Node} node
	 * @returns {Readonly<SplitResult>}
	 *
	 * @typedef SplitResult
	 * @property {boolean | undefined} [newline] If `newline` is `false` (or undefined), then `rest` will be
	 * `undefined`.
	 * @property {Node | undefined} [rest]
	 */
	function splitNode(node) {
		switch (node.nodeType) {
			case Node.ELEMENT_NODE:
				var element = /** @type {Element} */ (node);

				for (var i = 0, l = element.childNodes.length; i < l; i++) {
					var child = element.childNodes[i];
					var res = splitNode(child);

					if (res.newline) {
						if (!res.rest && i === l - 1) {
							// This child is the last child and ends with a newline and nothing after it.
							// Example: <span>foo\n</span>
							return NO_SPLIT_NEWLINE;
						}

						// create a copy of the element without any child nodes (shallow copy)
						var restElement = /** @type {Element} */ (element.cloneNode(false));

						// append the rest of the split result of the current child to the new element
						if (res.rest) {
							restElement.append(res.rest);
						}
						// append all child nodes of the current child to the new element
						transferLastChildNodes(element, restElement, l - i - 1);

						return { newline: true, rest: restElement };
					}
				}

				// This will be reached if the element has no children or none of the children contains a newline.
				// Example: <span>foo</span>
				return NO_SPLIT;

			case Node.TEXT_NODE:
				var text = /** @type {Text} */ (node);

				var newlineIndex = text.data.indexOf('\n');
				if (newlineIndex === -1) {
					// This text does not contain a newline.
					return NO_SPLIT;

				} else if (newlineIndex === text.data.length - 1) {
					// This text ends a line with nothing after it.
					return NO_SPLIT_NEWLINE;

				} else {
					// This text contains a newlines and there are some characters after the first line.
					var restText = text.splitText(newlineIndex + 1);
					return { newline: true, rest: restText };
				}

			default:
				// In all other cases, we will just assume that the node doesn't contribute to the textContent and
				// therefore cannot contain newlines. Example: comments.
				return NO_SPLIT;
		}
	}


	var parser = new DOMParser();

	Prism.hooks.add('before-insert', function (env) {
		// works only for <code> wrapped inside <pre> (not inline)

		/** @type {HTMLPreElement} */
		var pre = env.element.parentNode;
		if (!pre || !/^pre$/i.test(pre.nodeName)) {
			return;
		}

		// event/hook: before-lines

		var dom = parser.parseFromString(env.highlightedCode, 'text/html');
		/** @type {readonly Node[]} */
		var domNodes = drainChildNodes(dom.body);
		var wrapper = dom.createElement('div');

		/**
		 * @param {readonly Node[]} childNodes
		 */
		function addLine(childNodes) {
			var line = dom.createElement('div');
			line.className = 'code-line';
			// event/hook: after-line-create
			line.append.apply(line, childNodes);
			// event/hook: before-add-line
			wrapper.append(line);
		}

		var lineNodes = [];

		// This outer loop will go through all nodes in the DOM in order.
		// This can be thought of as iterating over all top-level tokens.
		for (var i = 0, l = domNodes.length; i < l; i++) {
			/** @type {Node | undefined} */
			var currentNode = domNodes[i];

			// The inner loop will process the current node. The current node may be split any number of times and the
			// split result also has to be processed.
			while (currentNode) {
				var res = splitNode(currentNode);
				lineNodes.push(currentNode);

				if (res.newline) {
					// the returned node contains a newline, so we have to create a new line
					addLine(lineNodes);
					lineNodes.length = 0;

					// the node was split and there is still some part of it left to precess
					currentNode = res.rest;

				} else {
					// the current node doesn't contain a newline, so we just append it to the current line and
					// process the next node.
					break;
				}
			}
		}

		if (lineNodes.length > 0) {
			addLine(lineNodes);
		}

		env.highlightedCode = wrapper.innerHTML;

		// event/hook: complete-lines
	});

}());
