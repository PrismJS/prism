(function(){

if (!self.Prism || !self.document || !document.querySelector) {
	return;
}

var Extensions = {
	'js': 'javascript',
	'html': 'markup',
	'svg': 'markup',
	'xml': 'markup',
	'py': 'python',
	'rb': 'ruby'
};

Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function(pre) {
	var src = pre.getAttribute('data-src');
	var extension = (src.match(/\.(\w+)$/) || [,''])[1];
	var language = Extensions[extension] || extension;

	var start = 0, end;
	if (pre.hasAttribute('data-start')) {
		start = (parseInt(pre.getAttribute('data-start'), 10) - 1);
		start = Math.max(start, 0);
	}
	if (pre.hasAttribute('data-end')) {
		end = parseInt(pre.getAttribute('data-end'), 10);
	}
	
	var code = document.createElement('code');
	code.className = 'language-' + language;
	
	pre.textContent = '';
	
	code.textContent = 'Loading…';
	
	pre.appendChild(code);
	
	var xhr = new XMLHttpRequest();
	
	xhr.open('GET', src, true);

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			
			if (xhr.status < 400 && xhr.responseText) {
				if (start || end) {
					code.textContent = xhr.responseText.split('\n').slice(start, end).join('\n');
				} else {
					code.textContent = xhr.responseText;
				}
			
				Prism.highlightElement(code);
			}
			else if (xhr.status >= 400) {
				code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
			}
			else {
				code.textContent = '✖ Error: File does not exist or is empty';
			}
		}
	};
	
	xhr.send(null);
});

})();
