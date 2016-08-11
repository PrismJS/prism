(function(){

if (typeof self === 'undefined' || !self.Prism || !self.document) {
	return;
}

Prism.hooks.add('before-highlight', function(env) {
	var code = env.element;
	var pre = code.parentNode;
	if (!pre || !/pre/i.test(pre.nodeName)) {
		return;
	}
	var filename = code.getAttribute('data-filename') || pre.getAttribute('data-filename') || pre.getAttribute('data-src');
	if (!filename) {
		return;
	}

	/* check if the divs already exist */
	var sib = pre.previousSibling;
	var div, div2;
	if (sib && /\s*\bprism-show-filename\b\s*/.test(sib.className) &&
		sib.firstChild &&
		/\s*\bprism-show-filename-label\b\s*/.test(sib.firstChild.className)) {
		div2 = sib.firstChild;
	} else {
		div = document.createElement('div');
		div2 = document.createElement('div');

		div2.className = 'prism-show-filename-label';

		div.className = 'prism-show-filename';
		div.appendChild(div2);

		pre.parentNode.insertBefore(div, pre);
	}

	div2.innerHTML = filename;
});

})();
