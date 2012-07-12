$$('pre[data-src]').forEach(function(pre) {
	var src = pre.getAttribute('data-src');
	
	var language = {
		'js': 'javascript',
		'css': 'css',
		'html': 'markup',
		'svg': 'markup'
	}[(src.match(/\.(\w+)$/) || [,''])[1]]
	
	pre.className = 'prism language-' + language;
	
	$u.xhr({
		url: src,
		callback: function(xhr) {
			pre.textContent = xhr.responseText;
			
			Prism.highlight(pre, true);
		}
	});
});