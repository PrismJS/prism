(function(){

if(!window.Prism
 || !window.addEventListener 
 || !window.getComputedStyle
 || !document.querySelectorAll) {
	return;
}

function $$(expr, con) {
	return Array.prototype.slice.call((con || document).querySelectorAll(expr));
}

var CRLF = crlf = /\r?\n|\r/g,
    preTag = /pre/i;
    
function highlightLines(pre, lines, classes) {
	var ranges = lines.replace(/\s+/g, '').split(','),
	    offset = +pre.getAttribute('data-line-offset') || 0;
	    
	var cs = getComputedStyle(pre),
	    lineHeight = parseFloat(cs.lineHeight);

	for (var i=0, range; range = ranges[i++];) {
		range = range.split('-');
					
		var start = +range[0],
		    end = +range[1] || start;
		
		var line = document.createElement('div');
		
		line.className = (classes || '') + ' line-highlight';
		line.setAttribute('data-start', start);
		
		if(end > start) {
			line.setAttribute('data-end', end);
		}
	
		line.style.height = (end - start + 1) * lineHeight + 'px';
		line.style.top = (start - offset - 1) * lineHeight + 'px';
		
		pre.insertBefore(line, pre.firstChild);
	}
}

function applyHash() {
	var hash = location.hash.slice(1);
	
	// Remove pre-existing temporary lines
	$$('.temporary.line-highlight').forEach(function (line) {
		line.parentNode.removeChild(line);
	});
	
	var range = (hash.match(/\.([\d,-]+)$/) || [,''])[1];
	
	if(!range || document.getElementById(hash)) {
		return;
	}
	
	var id = hash.slice(0, hash.lastIndexOf('.')),
	    pre = document.getElementById(id);
	    
	if(!pre) {
		return;
	}

	highlightLines(pre, range, 'temporary ');

	document.querySelector('.temporary.line-highlight').scrollIntoView();
}

var fakeTimer = 0; // Hack to limit the number of times applyHash() runs

Prism.hooks.add('after-highlight', function(env) {
	clearTimeout(fakeTimer);
	
	var pre = preTag.test(env.element.nodeName)? env.element
	        : preTag.test(env.element.parentNode.nodeName)? env.element.parentNode
	        : null,
	    lines = pre.getAttribute('data-line');
	
	if (!pre || !lines) {
		return;
	}
	
	$$('.line-highlight', pre).forEach(function (line) {
		line.parentNode.removeChild(line);
	});
	
	highlightLines(pre, lines);
	
	fakeTimer = setTimeout(applyHash, 1);
});

addEventListener('hashchange', applyHash);

})();