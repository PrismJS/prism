/**
 * Manage downloads
 */


(function() {

var cache = {};
var form = $('form');
var minified = true;

forId(function (category) {
	this.meta.section = $u.element.create('section', {
		className: 'options',
		contents: {
			tag: 'h1',
			contents: category.charAt(0).toUpperCase() + category.slice(1)
		},
		inside: '#components'
	});
}, function (id, category, info) {
	var checked = false, disabled = false;
	var option = this[id].option || this.meta.option;
	
	switch (option) {		
		case 'mandatory': disabled = true; // fallthrough
		case 'default': checked = true;
	}
	
	var all = this;

	var filepath = this.meta.path.replace(/\{id}/g, id);
	
	var info = this[id] = {
		title: this[id].title || this[id],
		hasCSS: this[id].hasCSS !== undefined? this[id].hasCSS : this.meta.hasCSS,
		enabled: checked,
		files: {
			minified: {
				paths: [],
				size: 0
			},
			dev: {
				paths: [],
				size: 0
			}
		}
	};
	
	if (!/\.css$/.test(filepath)) {
		info.files.minified.paths.push(filepath.replace(/(\.js)?$/, '.min.js'));
		info.files.dev.paths.push(filepath.replace(/(\.js)?$/, '.js'));
	}
	
	if ((this[id].hasCSS && !/\.js$/.test(filepath)) || /\.css$/.test(filepath)) {
		var cssFile = filepath.replace(/(\.css)?$/, '.css');
		
		info.files.minified.paths.push(cssFile);
		info.files.dev.paths.push(cssFile);
	}

	$u.element.create('label', {
		attributes: {
			'data-id': id
		},
		contents: [
			{
				tag: 'input',
				attributes: {
					'data-id': id
				},
				properties: {
					type: 'checkbox',
					checked: checked,
					disabled: disabled,
					onclick: function () {
						all[id].enabled = this.checked;
						
						update(category, id);
					}
				}
			},
			this.meta.link? {
				tag: 'a',
				properties: {
					href: this.meta.link.replace(/\{id}/g, id)
				},
				contents: info.title
			} : info.title,
			' ',
			{
				tag: 'strong',
				className: 'filesize'
			}
		],
		inside: this.meta.section
	});
});

form.elements.compression[0].onclick = 
form.elements.compression[1].onclick = function() {
	minified = !!+this.value;
	
	fetchFiles();
}

function forId(categoryCallback, callback) {
	if (arguments.length == 1) {
		callback = categoryCallback;
		categoryCallback = undefined;
	}
	
	for (var category in components) {
		var all = components[category];
		
		categoryCallback && categoryCallback.call(all, category);
		
		for (var id in all) {
			if(id === 'meta') {
				continue;
			}
			
			callback.call(all, id, category, all[id]);
		}
	}
}

function fetchFiles() {
	forId(function(id, category) {
		var distro = this[id].files[minified? 'minified' : 'dev'],
						files = distro.paths;
			
		files.forEach(function (filepath) {
			var file = cache[filepath] = cache[filepath] || {};
			
			if (!file.contents) {

				(function(category, id, file, filepath, distro){

				$u.xhr({
					url: filepath,
					callback: function(xhr) {
						if (xhr.status < 400) {
							
							file.contents = xhr.responseText;
							
							file.size = +xhr.getResponseHeader('Content-Length') || file.contents.length;

							distro.size += file.size;
							
							update(category, id);
						}
					}
				});
				})(category, id, file, filepath, distro);
			}
			else {
				update(category, id);
			}
		});
	});
}

fetchFiles();

function prettySize(size) {
	return Math.round(100 * size / 1024)/100 + 'KB';
}

function update(category, id){
	var distro = components[category][id].files[minified? 'minified' : 'dev'];
	
	$('label[data-id="' + id + '"] .filesize').textContent = prettySize(distro.size);
	
	// Update total size
	var totalSize = 0;
	
	forId(function (id, category, info) {
		if(info.enabled) {
			totalSize += info.files[minified? 'minified' : 'dev'].size;
		}
	});
	
	$('#filesize').textContent = prettySize(totalSize);
	
	generateCode();
}

function generateCode(){
	var css = '', js = '';
	
	forId(function (id, category, info) {
		if(info.enabled) {
			info.files[minified? 'minified' : 'dev'].paths.forEach(function (path) {
				if (cache[path]) {
					if (/.css$/.test(path)) {
						css += cache[path].contents + '\n';
					}
					else {
						js += cache[path].contents + '\n';
					}
				}
			});
		}
	});
	
	var jsCode = $('#download-js code'),
	    cssCode = $('#download-css code');
	
	jsCode.textContent = js;
	Prism.highlightElement(jsCode, true);
	
	cssCode.textContent = css;
	Prism.highlightElement(cssCode, true);
	
	$('#download-js .download-button').href = 'data:text/javascript;charset=utf-8,' + encodeURIComponent(js);
	$('#download-css .download-button').href = 'data:text/css;charset=utf-8,' + encodeURIComponent(css);
}

})();