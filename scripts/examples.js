/**
 * Manage examples
 */

(function() {

var examples = {};

var treeURL = 'https://api.github.com/repos/PrismJS/prism/git/trees/master?recursive=1';
var treePromise = new Promise(function (resolve) {
	$u.xhr({
		url: treeURL,
		callback: function (xhr) {
			if (xhr.status < 400) {
				resolve(JSON.parse(xhr.responseText).tree);
			}
		}
	});
});

var languages = components.languages;

Promise.all(Object.keys(languages).filter(function (id) { return id !== 'meta'; }).map(function (id) {
	var language = languages[id];

	language.enabled = language.option === 'default';
	language.path = languages.meta.path.replace(/\{id}/g, id) + '.js';
	language.examplesPath = languages.meta.examplesPath.replace(/\{id}/g, id) + '.html';

	return fileExists(language.examplesPath).then(function (exists) {
		return { id: id, exists: exists };
	});
})).then(function (values) {
	values.forEach(function (result) {
		var id = result.id;
		var exists = result.exists;
		var language = languages[id];
		var checked = language.enabled;

		$u.element.create('label', {
			attributes: {
				'data-id': id,
				'title': !exists ? 'No examples are available for this language.' : ''
			},
			className: !exists ? 'unavailable' : '',
			contents: [
				{
					tag: 'input',
					properties: {
						type: 'checkbox',
						name: 'language',
						value: id,
						checked: checked && exists,
						disabled: !exists,
						onclick: function () {
							$$('input[name="' + this.name + '"]').forEach(function (input) {
								languages[input.value].enabled = input.checked;
							});

							update(id);
						}
					}
				},
				language.title
			],
			inside: '#languages'
		});
		examples[id] = $u.element.create('section', {
			'id': 'language-' + id,
			'className': 'language-' + id,
			inside: '#examples'
		});
		if (checked) {
			update(id);
		}
	});
});


function fileExists(filepath) {
	return treePromise.then(function (tree) {
		for (var i = 0, l = tree.length; i < l; i++) {
			if (tree[i].path === filepath) {
				return true;
			}
		}

		// on localhost: The missing example might be for a new language
		if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
			return getFileContents(filepath).then(function () { return true; }, function () { return false; });
		}

		return false;
	});
}

function getFileContents(filepath) {
	return new Promise(function (resolve, reject) {
		$u.xhr({
			url: filepath,
			callback: function (xhr) {
				if (xhr.status < 400 && xhr.responseText) {
					resolve(xhr.responseText);
				} else {
					reject();
				}
			}
		});
	});
}

function buildContentsHeader(id) {
	var language = languages[id];
	var header = '<h1>' + language.title + '</h1>';
	if (language.overrideExampleHeader) {
		return header;
	}
	if (language.alias) {
		var alias = language.alias;
		if (!Array.isArray(alias)) {
			alias = [alias];
		}

		header += '<p>To use this language, use one of the following classes:</p>';
		header += '<ul><li><code class="language-none">"language-' + id + '"</code></li>';
		alias.forEach(function (alias) {
			header += '<li><code class="language-none">"language-' + alias + '"</code></li>';
		});
		header += '</ul>';
	} else {
		header += '<p>To use this language, use the class <code class="language-none">"language-' + id + '"</code>.</p>';
	}
	if (language.require) {
		var require = language.require;
		if (!Array.isArray(require)) {
			require = [require];
		}

		header += '<p><strong>Dependencies:</strong> The following dependencies need to be loaded before this component: ';
		header += require.map(function (dep) {
			return '<code class="language-none">' + dep + '</code>';
		}).join(', ');
		header += '.</p>';
	}
	return header;
}

function update(id) {
	var language = languages[id];
	if (language.enabled) {
		if (!language.examplesPromise) {
			language.examplesPromise = getFileContents(language.examplesPath);
		}
		language.examplesPromise.then(function (contents) {
			/** @type {HTMLElement} */
			var container = examples[id];
			container.innerHTML = buildContentsHeader(id) + contents;

			// the current language might be an extension of a language
			// so to be safe, we explicitly add a dependency to the current language
			$$('code', container).forEach(/** @param {HTMLElement} code */function (code) {
				var dependencies = code.getAttribute('data-dependencies');
				if (!dependencies) {
					var parent = code.parentElement;
					if (parent) {
						dependencies = parent.getAttribute('data-dependencies');
					}
				}

				dependencies = (dependencies || '').trim();
				dependencies = dependencies ? dependencies + ',' + id : id;

				code.setAttribute('data-dependencies', dependencies);
			});

			Prism.highlightAllUnder(container);
		});
	} else {
		examples[id].innerHTML = '';
	}
}

}());
