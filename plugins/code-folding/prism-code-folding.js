(function(){

if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
	return;
}

function getFoldingeFunction(container) {
	return function() {
		if (container.className === "prism-folding prism-folding-closed") {
			container.className = "prism-folding";
			return false;
		}
		container.className = "prism-folding prism-folding-closed";
		return false;
	};
};

function createFoldings(newLinesNodes, lines, closed) {
    var ranges = lines.replace(/\s+/g, '').split(',');
	for (var i = 0; i < ranges.length; i++) {
		var range = ranges[i].split('-');
		var start = range[0];
		var end = range[1] - 1;
		var divFoldingContainer = document.createElement('span');
		divFoldingContainer.className = "prism-folding";
		if (closed) {
			divFoldingContainer.className = "prism-folding prism-folding-closed";
		}
		var divFoldingNode = document.createElement('span');
		divFoldingNode.className = "prism-folding-node";
		divFoldingContainer.appendChild(divFoldingNode);
		var parent = newLinesNodes[start].nextSibling.parentNode;
		parent.insertBefore(divFoldingContainer, newLinesNodes[start].nextSibling);
		var currentNode = divFoldingContainer.nextSibling;
		while (currentNode !== newLinesNodes[end]) {
			movingNode = currentNode;
			currentNode = currentNode.nextSibling;
			divFoldingNode.appendChild(movingNode);
		}
		divFoldingNode.appendChild(newLinesNodes[end]);

		var foldingFunction = getFoldingeFunction(divFoldingContainer);

		var arrowDown = document.createElement("span");
		arrowDown.appendChild(document.createTextNode("\u25BD"));
		arrowDown.className = "prism-folding-arrow prism-folding-arrow-down";
		divFoldingContainer.appendChild(arrowDown);
		arrowDown.addEventListener('click', foldingFunction);

		var arrowUp = document.createElement("span");
		arrowUp.appendChild(document.createTextNode("\u25B3"));
		arrowUp.className = "prism-folding-arrow prism-folding-arrow-up";
		divFoldingContainer.appendChild(arrowUp);
		arrowUp.addEventListener('click', foldingFunction);
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
    var foldingOpenLines = pre && pre.getAttribute('data-folding-open');
    var foldingClosedLines = pre && pre.getAttribute('data-folding-closed');

    if (!pre || !(foldingOpenLines || foldingClosedLines) || !/pre/i.test(pre.nodeName)) {
        return;
    }
	var element = env.element;
	var newLinesNodes = splitAndReturnNewLineElements(element);
	if (foldingOpenLines) {
    	createFoldings(newLinesNodes, foldingOpenLines);
	}
	if (foldingClosedLines) {
	    createFoldings(newLinesNodes, foldingClosedLines, true);
	}
});

})();
