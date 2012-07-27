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

// calc()
(function(){

	if (PrefixFree.functions.indexOf('calc') == -1) {
		var style = document.createElement('_').style;
		style.width = 'calc(1px + 1%)'
		
		if(!style.width) {
			// calc not supported
			var header = $('header'),
			    footer = $('footer');
			    
			function calculatePadding() {
				header.style.padding =
				footer.style.padding = '30px ' + (innerWidth/2 - 450) + 'px';
			}
			
			addEventListener('resize', calculatePadding);
			calculatePadding();
		}
	}
})();