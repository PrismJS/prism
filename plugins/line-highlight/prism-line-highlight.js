(function(){

if(!window.Prism || !window.getComputedStyle) {
	return;
}

var CRLF = crlf = /\r?\n|\r/g;

Prism.hooks.add('after-highlight', function(env) {
	var pre = /pre/i.test(env.element.nodeName)? env.element
	          : /pre/i.test(env.element.parentNode.nodeName)? env.element.parentNode
	          : null;
	
	if (!pre || !pre.hasAttribute('data-line')) {
		return;
	}
	
	var ranges = pre.getAttribute('data-line').replace(/\s+/g, '').split(',');
	var offset = +pre.getAttribute('data-line-offset') || 0;
	
	for (var i=0, range; range=ranges[i++];) {
		range = range.split('-');
		
		var start = +range[0], end = +range[1] || start;
		
		var line = document.createElement('div');
		line.className = 'line-highlight';
		line.setAttribute('data-start', start);
		
		if(end > start) {
			line.setAttribute('data-end', end);
		}
		
		var lines = (env.code.match(CRLF) || []).length + 1,
		    lineHeight = parseFloat(getComputedStyle(pre).height)/lines;

		line.style.height = (end - start + 1) * lineHeight + 'px';
		line.style.top = (start - offset - 1) * lineHeight + 'px';
		
		pre.insertBefore(line, pre.firstChild);
	}
});

})();