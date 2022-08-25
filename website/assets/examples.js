/**
 * Manage examples
 */

(function () {

	const examples = {};

	const treeURL = 'https://api.github.com/repos/PrismJS/prism/git/trees/master?recursive=1';
	const treePromise = new Promise((resolve) => {
		$u.xhr({
			url: treeURL,
			callback(xhr) {
				if (xhr.status < 400) {
					resolve(JSON.parse(xhr.responseText).tree);
				}
			}
		});
	});

	const languages = components.languages;

	Promise.all(Object.keys(languages).filter((id) => id !== 'meta').map((id) => {
		const language = languages[id];

		language.enabled = language.option === 'default';
		language.path = languages.meta.path.replace(/\{id\}/g, id) + '.js';
		language.examplesPath = languages.meta.examplesPath.replace(/\{id\}/g, id) + '.html';

		return fileExists(language.examplesPath).then((exists) => {
			return { id, exists };
		});
	})).then((values) => {
		values.forEach((result) => {
			const id = result.id;
			const exists = result.exists;
			const language = languages[id];
			const checked = language.enabled;

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
							onclick() {
								$$('input[name="' + this.name + '"]').forEach((input) => {
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
		return treePromise.then((tree) => {
			for (let i = 0, l = tree.length; i < l; i++) {
				if (tree[i].path === filepath) {
					return true;
				}
			}

			// on localhost: The missing example might be for a new language
			if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
				return getFileContents(filepath).then(() => true, () => false);
			}

			return false;
		});
	}

	function getFileContents(filepath) {
		return new Promise((resolve, reject) => {
			$u.xhr({
				url: filepath,
				callback(xhr) {
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

		const language = languages[id];
		let header = '<h1>' + language.title + '</h1>';

		if (language.alias) {
			const alias = toArray(language.alias);

			header += '<p>To use this language, use one of the following classes:</p>';
			header += '<ul><li><code class="language-none">"language-' + id + '"</code></li>';
			alias.forEach((alias) => {
				header += '<li><code class="language-none">"language-' + alias + '"</code></li>';
			});
			header += '</ul>';
		} else {
			header += '<p>To use this language, use the class <code class="language-none">"language-' + id + '"</code>.</p>';
		}

		function wrapCode(text) {
			return '<code class="language-none">' + text + '</code>';
		}

		const deps = [];
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
				deps.forEach((text) => {
					header += '<li>' + text + '.</li>';
				});
				header += '</ul>';
			}
			header += '</p>';
		}

		return header;
	}

	function update(id) {
		const language = languages[id];
		if (language.enabled) {
			if (!language.examplesPromise) {
				language.examplesPromise = getFileContents(language.examplesPath);
			}
			language.examplesPromise.then((contents) => {
				examples[id].innerHTML = buildContentsHeader(id) + contents;

				/** @type {HTMLElement} */
				const container = examples[id];
				container.innerHTML = buildContentsHeader(id) + contents;

				// the current language might be an extension of a language
				// so to be safe, we explicitly add a dependency to the current language
				$$('pre', container).forEach(/** @param {HTMLElement} pre */(pre) => {
					let dependencies = (pre.getAttribute('data-dependencies') || '').trim();
					dependencies = dependencies ? dependencies + ',' + id : id;
					pre.setAttribute('data-dependencies', dependencies);
				});

				Prism.highlightAllUnder(container);
			});
		} else {
			examples[id].innerHTML = '';
		}
	}
}());
