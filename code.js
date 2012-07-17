$$('[data-src]').forEach(function(element) {
	var src = element.getAttribute('data-src'),
	    html = element.getAttribute('data-type') === 'text/html',
	    contentProperty = html? 'innerHTML' : 'textContent';
	
	$u.xhr({
		url: src,
		callback: function(xhr) {
			element[contentProperty] = xhr.responseText;
			
			$u.event.fire(element, 'contentreceived', {
				src: src
			});
		}
	});
});

document.body.addEventListener('contentreceived', function(evt) {
	var pre = evt.target;
	
	if(!/pre/i.test(pre.nodeName)) {
		return;
	}

	var language = {
		'js': 'javascript',
		'css': 'css',
		'html': 'markup',
		'svg': 'markup'
	}[(evt.src.match(/\.(\w+)$/) || [,''])[1]];
	
	pre.className = 'prism language-' + language;
	
	Prism.highlight(pre, true);
});