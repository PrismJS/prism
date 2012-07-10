$$('iframe').forEach(function(iframe) {
	(iframe.onload = function() {	
		var doc = iframe.contentDocument,
		    pre = $('pre', doc),
		    language = /.css$/.test(iframe.src)? 'css' : 'javascript',
		    depth = (iframe.getAttribute('src').match(/\//g) || []).length,
		    pathPrefix = Array(depth + 1).join('../');

		if(!pre) {
			return;
		}
		
		iframe.onload = null;

		pre.className = 'prism language-' + language;
		pre.style.whiteSpace = 'pre';
		pre.style.wordWrap = 'normal';
		
		var height = doc.documentElement.offsetHeight;
		if (height && iframe.offsetHeight > height) {
			iframe.style.height = height + 'px';
		}
		
		$u.element.create('link', {
			properties: {
				href: pathPrefix + 'style.css',
				rel: 'stylesheet'
			},
			inside: $('head', doc)
		});
		
		$u.element.create('link', {
			properties: {
				href: pathPrefix + 'prism.css',
				rel: 'stylesheet'
			},
			inside: $('head', doc)
		});
		
		Prism.highlight(pre);
	})();
});

setTimeout(function(){
	var code = $('code', innerHTML);
	code.innerHTML = document.documentElement.innerHTML
		.replace(/&lt;/g, '&amp;lt;')
		.replace(/</g, '&lt;');
	Prism.highlight(code);
},1000);
