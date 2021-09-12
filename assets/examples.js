/**
 * Manage examples
 */

(function () {

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
		language.path = languages.meta.path.replace(/\{id\}/g, id) + '.js';
		language.examplesPath = languages.meta.examplesPath.replace(/\{id\}/g, id) + '.html';

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
		function toArray(value) {
			if (Array.isArray(value)) {
				return value;
			} else if (value != null) {
				return [value];
			} else {
				return [];
			}
		}

		var language = languages[id];
		var header = '<h1>' + language.title + '</h1>';

		if (language.alias) {
			var alias = toArray(language.alias);

			header += '<p>To use this language, use one of the following classes:</p>';
			header += '<ul><li><code class="language-none">"language-' + id + '"</code></li>';
			alias.forEach(function (alias) {
				header += '<li><code class="language-none">"language-' + alias + '"</code></li>';
			});
			header += '</ul>';
		} else {
			header += '<p>To use this language, use the class <code class="language-none">"language-' + id + '"</code>.</p>';
		}

		function wrapCode(text) {
			return '<code class="language-none">' + text + '</code>';
		}

		var deps = [];
		if (language.require) {
			deps.push('requires ' + toArray(language.require).map(wrapCode).join(', '));
		}
		if (language.optional) {
			deps.push('optionally uses ' + toArray(language.optional).map(wrapCode).join(', '));
		}
		if (language.modify) {
			deps.push('modifies ' + toArray(language.modify).map(wrapCode).join(', '));
		}
		if (deps.length) {
			header += '<p>';
			header += '<a href="https://prismjs.com/extending.html#dependencies"><strong>Dependencies:</strong></a>';
			header += ' This component';
			if (deps.length === 1) {
				header += ' ' + deps[0] + '.';
			} else {
				header += ':';
				header += '<ul>';
				deps.forEach(function (text) {
					header += '<li>' + text + '.</li>';
				});
				header += '</ul>';
			}
			header += '</p>';
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
				examples[id].innerHTML = buildContentsHeader(id) + contents;

				loadLanguage(id).then(function () {
					Prism.highlightAllUnder(examples[id]);
				});
			});
		} else {
			examples[id].innerHTML = '';
		}
	}

	/**
	 * Loads a language, including all dependencies
	 *
	 * @param {string} lang the language to load
	 * @returns {Promise} the promise which resolves as soon as everything is loaded
	 */
	function loadLanguage(lang) {
		// at first we need to fetch all dependencies for the main language
		// Note: we need to do this, even if the main language already is loaded (just to be sure..)
		//
		// We load an array of all dependencies and call recursively this function on each entry
		//
		// dependencies is now an (possibly empty) array of loading-promises
		var dependencies = getDependenciesOfLanguage(lang).map(loadLanguage);

		// We create a promise, which will resolve, as soon as all dependencies are loaded.
		// They need to be fully loaded because the main language may extend them.
		return Promise.all(dependencies)
			.then(function () {

				// If the main language itself isn't already loaded, load it now
				// and return the newly created promise (we chain the promises).
				// If the language is already loaded, just do nothing - the next .then()
				// will immediately be called
				if (!Prism.languages[lang]) {
					return new Promise(function (resolve) {
						$u.script('components/prism-' + lang + '.js', resolve);
					});
				}
			});
	}


	/**
	 * Returns all dependencies (as identifiers) of a specific language
	 *
	 * @param {string} lang
	 * @returns {string[]} the list of dependencies. Empty if the language has none.
	 */
	function getDependenciesOfLanguage(lang) {
		if (!components.languages[lang] || !components.languages[lang].require) {
			return [];
		}

		return ($u.type(components.languages[lang].require) === 'array')
			? components.languages[lang].require
			: [components.languages[lang].require];
	}

}());
