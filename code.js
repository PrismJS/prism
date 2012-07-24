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
	
	pre.className = 'prism';
	
	var code = document.createElement('code');
	
	code.className = 'lang-' + language;
	
	code.textContent = pre.textContent;
	pre.textContent = '';
	
	pre.appendChild(code);
	
	Prism.highlightElement(code);
});

/**
 * Table of contents
 */
(function(){
var toc = document.createElement('ol');

$$('body > section > h1').forEach(function(heading) {
	var section = heading.parentNode;

	$u.element.create('li', {
		contents: {
			tag: 'a',
			properties: {
				href: '#' + (heading.id || section.id)
			},
			contents: heading.textContent
		},
		inside: toc
	});
});

if(toc.children.length > 0) {
	$u.element.create('section', {
		properties: {
			id: 'toc'
		},
		contents: [{
			tag: 'h1',
			contents: 'On this page'
		}, toc],
		before: $('body > section')
	});
}

})();