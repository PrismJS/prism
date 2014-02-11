(function(){

if (!self.Prism || !self.document || !document.querySelector) {
	return;
}

var Extensions = {
	'js': 'javascript',
	'html': 'markup',
	'svg': 'markup'
};

Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function(pre) {
	var src = pre.getAttribute('data-src');
	var extension = (src.match(/\.(\w+)$/) || [,''])[1];
	var language = Extensions[extension] || extension;
	
	var code = document.createElement('code');
	code.className = 'language-' + language;
	
	pre.textContent = '';
	
	code.textContent = 'Loading…';
	
	pre.appendChild(code);
	
	var xhr = new XMLHttpRequest();

	/* Detect GitHub */
	var githuburl = /https:\/\/github.com\//i.test(src);
	if(githuburl){
		var match = src.match( /https:\/\/github.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([\s\S]+)/);
		var username = match[1];
		var repository = match[2];
		var fullpath = match[5];
		src = 'https://api.github.com/repos/' + username + '/' + repository + '/contents/' + fullpath;
	}

	xhr.open('GET', src, true);

	/* If GitHub link, set Accept to raw */
	if(githuburl){
		xhr.setRequestHeader('Accept', 'application/vnd.github.v3.raw');
	}

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			
			if (xhr.status < 400 && xhr.responseText) {
				code.textContent = xhr.responseText;
			
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
