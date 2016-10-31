(function(){

if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
	return;
}

function getCollapseFunction(container) {
	return function() {
		if (container.className === "prism-collapse prism-collapse-closed") {
			container.className = "prism-collapse";
			return false;
		}
		container.className = "prism-collapse prism-collapse-closed";
		return false;
	};
};

function createCollapse(newLinesNodes, lines, closed) {
    var ranges = lines.replace(/\s+/g, '').split(',');
	for (var i = 0; i < ranges.length; i++) {
		var range = ranges[i].split('-');
		var start = range[0];
		var end = range[1] - 1;
		var divCollapseContainer = document.createElement('div');
		divCollapseContainer.className = "prism-collapse";
		if (closed) {
			divCollapseContainer.className = "prism-collapse prism-collapse-closed";
		}
		var divCollapseNode = document.createElement('div');
		divCollapseContainer.appendChild(divCollapseNode);
		var parent = newLinesNodes[start].nextSibling.parentNode;
		parent.insertBefore(divCollapseContainer, newLinesNodes[start].nextSibling);
		var currentNode = divCollapseContainer.nextSibling;
		while (currentNode !== newLinesNodes[end]) {
			movingNode = currentNode;
			currentNode = currentNode.nextSibling;
			divCollapseNode.appendChild(movingNode);
		}
		parent.removeChild(newLinesNodes[end]);

		var collapseFunction = getCollapseFunction(divCollapseContainer);

		var arrowDown = document.createElement("span");
		arrowDown.appendChild(document.createTextNode("\u25BD"));
		arrowDown.className = "prism-collapse-arrow prism-collapse-arrow-down";
		divCollapseContainer.appendChild(arrowDown);
		arrowDown.addEventListener('click', collapseFunction);

		var arrowUp = document.createElement("span");
		arrowUp.appendChild(document.createTextNode("\u25B3"));
		arrowUp.className = "prism-collapse-arrow prism-collapse-arrow-up";
		divCollapseContainer.appendChild(arrowUp);
		arrowUp.addEventListener('click', collapseFunction);
	}
}

function splitAndReturnNewLineElements(element) {
	var children = element.childNodes;
	var newLinesNodes = [];
	var newLineCounter = 0;
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		if (child.nodeType === Node.TEXT_NODE) {
			var textNodeValue = child.nodeValue;
			var splitOnNewLine = textNodeValue.split("\n");
			if (splitOnNewLine.length > 1) {
				var siblingBefore = child;
				var parent = child.parentNode;
				child.nodeValue = splitOnNewLine[0];
				for (var j = 1; j < splitOnNewLine.length; j++) {
					var newLineNode = document.createTextNode("\n");
					parent.insertBefore(newLineNode, siblingBefore.nextSibling);
					newLinesNodes[++newLineCounter] = newLineNode;
					var splitResultNode = document.createTextNode(splitOnNewLine[j]);
					parent.insertBefore(splitResultNode, newLineNode.nextSibling);
					i += 2;
					siblingBefore = splitResultNode;
				}
			}
		}
	}
	return newLinesNodes;
}

Prism.hooks.add('complete', function(env) {
    var pre = env.element.parentNode;
    var collapseOpenLines = pre && pre.getAttribute('data-collapse-open');
    var collapseClosedLines = pre && pre.getAttribute('data-collapse-closed');

    if (!pre || !(collapseOpenLines || collapseClosedLines) || !/pre/i.test(pre.nodeName)) {
        return;
    }
	var element = env.element;
	var newLinesNodes = splitAndReturnNewLineElements(element);
	if (collapseOpenLines) {
    	createCollapse(newLinesNodes, collapseOpenLines);
	}
	if (collapseClosedLines) {
	    createCollapse(newLinesNodes, collapseClosedLines, true);
	}
});

})();
