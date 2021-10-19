(function () {

	if (!document.body.addEventListener) {
		return;
	}

	$$('[data-plugin-header]').forEach(function (element) {
		var plugin = components.plugins[element.getAttribute('data-plugin-header')];
		element.innerHTML = '<div class="intro" data-src="assets/templates/header-plugins.html" data-type="text/html"></div>\n'
	+ '<h2>' + plugin.title + '</h2>\n<p>' + plugin.description + '</p>';
	});

	$$('[data-src][data-type="text/html"]').forEach(function (element) {
		var src = element.getAttribute('data-src');
		var html = element.getAttribute('data-type') === 'text/html';
		var contentProperty = html ? 'innerHTML' : 'textContent';

		$u.xhr({
			url: src,
			callback: function (xhr) {
				try {
					element[contentProperty] = xhr.responseText;

					// Run JS

					$$('script', element).forEach(function (script) {
						var parent = script.parentNode;
						parent.removeChild(script);
						document.head.appendChild(script);
					});
				} catch (e) { /* noop */ }
			}
		});
	});

}());

/**
 * Table of contents
 */
(function () {
	var toc = document.createElement('ol');

	$$('body > section > h1').forEach(function (h1) {
		var section = h1.parentNode;
		var text = h1.textContent;
		var id = h1.id || section.id;

		// Assign id if one does not exist
		if (!id) {
			id = text.toLowerCase();

			// Replace spaces with hyphens, only keep first 10 words
			id = id.split(/\s+/g, 10).join('-');

			// Remove non-word characters
			id = id.replace(/[^\w-]/g, '');

			section.id = id;
		}

		// Linkify heading text
		if (h1.children.length === 0) {
			h1.innerHTML = '';

			$u.element.create('a', {
				properties: {
					href: window.location.pathname + '#' + id
				},
				contents: text,
				inside: h1
			});
		}

		$u.element.create('li', {
			contents: {
				tag: 'a',
				properties: {
					href: window.location.pathname + '#' + (h1.id || section.id)
				},
				contents: text
			},
			inside: toc
		});
	});

	if (toc.children.length > 0) {
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

}());

/**
 * Linkify h2
 */
(function () {
	$$('section h2[id]').forEach(function (h2) {
		var text = h2.textContent;
		h2.innerHTML = '';

		$u.element.create('a', {
			properties: {
				href: window.location.pathname + '#' + h2.id
			},
			contents: text,
			inside: h2
		});
	});
}());

// calc()
(function () {
	if (!window.PrefixFree) {
		return;
	}

	if (PrefixFree.functions.indexOf('calc') == -1) {
		var style = document.createElement('_').style;
		style.width = 'calc(1px + 1%)';

		if (!style.width) {
			// calc not supported
			var header = $('header');
			var footer = $('footer');

			function calculatePadding() {
				header.style.padding =
				footer.style.padding = '30px ' + (innerWidth / 2 - 450) + 'px';
			}

			addEventListener('resize', calculatePadding);
			calculatePadding();
		}
	}
}());

// setTheme is intentionally global,
// so it can be accessed from download.js
var setTheme;
(function () {
	var p = $u.element.create('p', {
		properties: {
			id: 'theme'
		},
		contents: {
			tag: 'p',
			contents: 'Theme:'
		},
		after: '.intro'
	});

	var themes = components.themes;
	var current = (location.search.match(/theme=([\w-]+)/) || [])[1];

	if (!(current in themes)) {
		current = undefined;
	}

	if (current === undefined) {
		var stored = localStorage.getItem('theme');

		current = stored in themes ? stored : 'prism';
	}

	setTheme = function (id) {
		var link = $$('link[href^="themes/prism"]')[0];

		link.href = themes.meta.path.replace(/\{id\}/g, id);
		localStorage.setItem('theme', id);
	};

	for (var id in themes) {

		if (id === 'meta') {
			continue;
		}

		$u.element.create('input', {
			properties: {
				type: 'radio',
				name: 'theme',
				id: 'theme=' + id,
				checked: current === id,
				value: id,
				onclick: function () {
					setTheme(this.value);
				}
			},
			inside: p
		});

		$u.element.create('label', {
			properties: {
				htmlFor: 'theme=' + id
			},
			contents: themes[id].title || themes[id],
			inside: p
		});
	}

	setTheme(current);
}());

(function () {

	function listPlugins(ul) {
		for (var id in components.plugins) {
			if (id == 'meta') {
				continue;
			}

			var plugin = components.plugins[id];

			var li = $u.element.create('li', {
				contents: [
					{
						tag: 'a',
						prop: {
							href: 'plugins/' + id
						},
						contents: plugin.title || plugin
					},
					{
						tag: 'br'
					}
				],
				inside: ul
			});

			var desc = document.createElement('div');
			desc.innerHTML = plugin.description;
			li.appendChild(desc);
		}
	}

	$$('.plugin-list').forEach(listPlugins);

}());
