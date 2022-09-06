/**
 * Manage downloads
 */

(function () {

	const cache = {};
	const form = $('form');
	let minified = true;

	const dependencies = {};

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

	/**
	 * Converts the given value into an array.
	 *
	 * @param {T | T[] | null | undefined} value
	 * @returns {T[]}
	 * @template T
	 */
	function toArray(value) {
		if (Array.isArray(value)) {
			return value;
		} else {
			return value == null ? [] : [value];
		}
	}

	const hstr = window.location.hash.match(/(?:languages|plugins)=[-+\w]+|themes=[-\w]+/g);
	if (hstr) {
		hstr.forEach((str) => {
			const kv = str.split('=', 2);
			const category = kv[0];
			const ids = kv[1].split('+');
			if (category !== 'meta' && category !== 'core' && components[category]) {
				for (const id in components[category]) {
					if (components[category][id].option) {
						delete components[category][id].option;
					}
				}
				if (category === 'themes' && ids.length) {
					const themeInput = $('#theme input[value="' + ids[0] + '"]');
					if (themeInput) {
						themeInput.checked = true;
					}
					// eslint-disable-next-line no-undef
					setTheme(ids[0]);
				}
				var makeDefault = function (id) {
					if (id !== 'meta') {
						if (components[category][id]) {
							if (components[category][id].option !== 'default') {
								if (typeof components[category][id] === 'string') {
									components[category][id] = { title: components[category][id] };
								}
								components[category][id].option = 'default';
							}

							toArray(components[category][id].require).forEach(makeDefault);
						}
					}
				};
				ids.forEach(makeDefault);
			}
		});
	}

	// Stay compatible with old querystring feature
	const qstr = window.location.search.match(/(?:languages|plugins)=[-+\w]+|themes=[-\w]+/g);
	if (qstr && !hstr) {
		window.location.hash = window.location.search.replace(/^\?/, '');
		window.location.search = '';
	}

	const storedTheme = localStorage.getItem('theme');

	for (var category in components) {
		const all = components[category];

		all.meta.section = $u.element.create('section', {
			className: 'options',
			id: 'category-' + category,
			contents: {
				tag: 'h1',
				contents: category.charAt(0).toUpperCase() + category.slice(1)
			},
			inside: '#components'
		});

		if (all.meta.addCheckAll) {
			$u.element.create('label', {
				attributes: {
					'data-id': 'check-all-' + category
				},
				contents: [
					{
						tag: 'input',
						properties: {
							type: 'checkbox',
							name: 'check-all-' + category,
							value: '',
							checked: false,
							onclick: (function (category, all) {
								return function () {
									const checkAll = this;
									$$('input[name="download-' + category + '"]').forEach((input) => {
										all[input.value].enabled = input.checked = checkAll.checked;
									});

									update(category);
								};
							}(category, all))
						}
					},
					'Select/unselect all'
				],
				inside: all.meta.section
			});
		}

		for (var id in all) {
			if (id === 'meta') {
				continue;
			}

			let checked = false; let disabled = false;
			const option = all[id].option || all.meta.option;

			switch (option) {
				case 'mandatory': disabled = true; // fallthrough
				case 'default': checked = true;
			}
			if (category === 'themes' && storedTheme) {
				checked = id === storedTheme;
			}

			const filepath = all.meta.path.replace(/\{id\}/g, id);

			const info = all[id] = {
				title: all[id].title || all[id],
				aliasTitles: all[id].aliasTitles,
				noCSS: all[id].noCSS || all.meta.noCSS,
				noJS: all[id].noJS || all.meta.noJS,
				enabled: checked,
				require: toArray(all[id].require),
				after: toArray(all[id].after),
				modify: toArray(all[id].modify),
				owner: all[id].owner,
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

			info.require.forEach((v) => {
				dependencies[v] = (dependencies[v] || []).concat(id);
			});

			if (!all[id].noJS && !/\.css$/.test(filepath)) {
				info.files.minified.paths.push(filepath.replace(/(\.js)?$/, '.min.js'));
				info.files.dev.paths.push(filepath.replace(/(\.js)?$/, '.js'));
			}


			if ((!all[id].noCSS && !/\.js$/.test(filepath)) || /\.css$/.test(filepath)) {
				const cssFile = filepath.replace(/(\.css)?$/, '.css');
				const minCSSFile = cssFile.replace(/(?:\.css)$/, '.min.css');

				info.files.minified.paths.push(minCSSFile);
				info.files.dev.paths.push(cssFile);
			}

			function getLanguageTitle(lang) {
				if (!lang.aliasTitles) {
					return lang.title;
				}

				const titles = [lang.title];
				for (const alias in lang.aliasTitles) {
					if (lang.aliasTitles.hasOwnProperty(alias)) {
						titles.push(lang.aliasTitles[alias]);
					}
				}
				return titles.join(' + ');
			}

			const label = $u.element.create('label', {
				attributes: {
					'data-id': id
				},
				contents: [
					{
						tag: 'input',
						properties: {
							type: all.meta.exclusive ? 'radio' : 'checkbox',
							name: 'download-' + category,
							value: id,
							checked,
							disabled,
							onclick: (function (id, category, all) {
								return function () {
									$$('input[name="' + this.name + '"]').forEach((input) => {
										all[input.value].enabled = input.checked;
									});

									if (all[id].require && this.checked) {
										all[id].require.forEach((v) => {
											const input = $('label[data-id="' + v + '"] > input');
											input.checked = true;

											input.onclick();
										});
									}

									if (dependencies[id] && !this.checked) { // It’s required by others
										dependencies[id].forEach((dependent) => {
											const input = $('label[data-id="' + dependent + '"] > input');
											input.checked = false;

											input.onclick();
										});
									}

									update(category, id);
								};
							}(id, category, all))
						}
					},
					all.meta.link ? {
						tag: 'a',
						properties: {
							href: all.meta.link.replace(/\{id\}/g, id),
							className: 'name'
						},
						contents: info.title
					} : {
						tag: 'span',
						properties: {
							className: 'name'
						},
						contents: getLanguageTitle(info)
					},
					' ',
					all[id].owner ? {
						tag: 'a',
						properties: {
							href: 'https://github.com/' + all[id].owner,
							className: 'owner',
							target: '_blank'
						},
						contents: all[id].owner
					} : ' ',
					{
						tag: 'strong',
						className: 'filesize'
					}
				],
				inside: all.meta.section
			});

			// Add click events on main theme selector too.
			(function (label) {
				if (category === 'themes') {
					const themeInput = $('#theme input[value="' + id + '"]');
					const input = $('input', label);
					if (themeInput) {
						const themeInputOnclick = themeInput.onclick;
						themeInput.onclick = function () {
							input.checked = true;
							input.onclick();
							themeInputOnclick && themeInputOnclick.call(themeInput);
						};
					}
				}
			}(label));
		}
	}

	form.elements.compression[0].onclick =
		form.elements.compression[1].onclick = function () {
			minified = !!+this.value;

			getFilesSizes();
		};

	function getFileSize(filepath) {
		return treePromise.then((tree) => {
			for (let i = 0, l = tree.length; i < l; i++) {
				if (tree[i].path === filepath) {
					return tree[i].size;
				}
			}
		});
	}

	function getFilesSizes() {
		for (var category in components) {
			const all = components[category];

			for (var id in all) {
				if (id === 'meta') {
					continue;
				}

				var distro = all[id].files[minified ? 'minified' : 'dev'];
				const files = distro.paths;

				files.forEach((filepath) => {
					const file = cache[filepath] = cache[filepath] || {};

					if (!file.size) {

						(function (category, id) {
							getFileSize(filepath).then((size) => {
								if (size) {
									file.size = size;
									distro.size += file.size;

									update(category, id);
								}
							});
						}(category, id));
					} else {
						update(category, id);
					}
				});
			}
		}
	}

	getFilesSizes();

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

	function prettySize(size) {
		return Math.round(100 * size / 1024) / 100 + 'KB';
	}

	function update(updatedCategory, updatedId) {
		// Update total size
		const total = { js: 0, css: 0 }; const updated = { js: 0, css: 0 };

		for (const category in components) {
			const all = components[category];
			let allChecked = true;

			for (var id in all) {
				var info = all[id];

				if (info.enabled || id === updatedId) {
					const distro = info.files[minified ? 'minified' : 'dev'];

					distro.paths.forEach((path) => {
						if (cache[path]) {
							const file = cache[path];

							const type = path.match(/\.(\w+)$/)[1];
							const size = file.size || 0;

							if (info.enabled) {

								if (!file.contentsPromise) {
									file.contentsPromise = getFileContents(path);
								}

								total[type] += size;
							}

							if (id === updatedId) {
								updated[type] += size;
							}
						}
					});
				}
				if (id !== 'meta' && !info.enabled) {
					allChecked = false;
				}

				// Select main theme
				if (category === 'themes' && id === updatedId && info.enabled) {
					const themeInput = $('#theme input[value="' + updatedId + '"]');
					if (themeInput) {
						themeInput.checked = true;
					}
					// eslint-disable-next-line no-undef
					setTheme(updatedId);
				}
			}

			if (all.meta.addCheckAll) {
				$('input[name="check-all-' + category + '"]').checked = allChecked;
			}
		}

		total.all = total.js + total.css;

		if (updatedId) {
			updated.all = updated.js + updated.css;

			$u.element.prop($('label[data-id="' + updatedId + '"] .filesize'), {
				textContent: prettySize(updated.all),
				title: (updated.js ? Math.round(100 * updated.js / updated.all) + '% JavaScript' : '') +
					(updated.js && updated.css ? ' + ' : '') +
					(updated.css ? Math.round(100 * updated.css / updated.all) + '% CSS' : '')
			});
		}

		$('#filesize').textContent = prettySize(total.all);

		$u.element.prop($('#percent-js'), {
			textContent: Math.round(100 * total.js / total.all) + '%',
			title: prettySize(total.js)
		});

		$u.element.prop($('#percent-css'), {
			textContent: Math.round(100 * total.css / total.all) + '%',
			title: prettySize(total.css)
		});

		delayedGenerateCode();
	}

	let timerId = 0;
	// "debounce" multiple rapid requests to generate and highlight code
	function delayedGenerateCode() {
		if (timerId !== 0) {
			clearTimeout(timerId);
		}
		timerId = setTimeout(generateCode, 500);
	}

	function generateCode() {
		/** @type {CodePromiseInfo[]} */
		const promises = [];
		const redownload = {};

		for (var category in components) {
			for (var id in components[category]) {
				if (id === 'meta') {
					continue;
				}

				const info = components[category][id];
				if (info.enabled) {
					if (category !== 'core') {
						redownload[category] = redownload[category] || [];
						redownload[category].push(id);
					}
					info.files[minified ? 'minified' : 'dev'].paths.forEach((path) => {
						if (cache[path]) {
							const type = path.match(/\.(\w+)$/)[1];

							promises.push({
								contentsPromise: cache[path].contentsPromise,
								id,
								category,
								path,
								type
							});
						}
					});
				}
			}
		}

		// Hide error message if visible
		const error = $('#download .error');
		error.style.display = '';

		Promise.all([buildCode(promises), getVersion()]).then((arr) => {
			const res = arr[0];
			const version = arr[1];
			const code = res.code;
			const errors = res.errors;

			if (errors.length) {
				error.style.display = 'block';
				error.innerHTML = '';
				$u.element.contents(error, errors);
			}

			let redownloadUrl = window.location.href.split('#')[0] + '#';
			for (const category in redownload) {
				redownloadUrl += category + '=' + redownload[category].join('+') + '&';
			}
			redownloadUrl = redownloadUrl.replace(/&$/, '');
			window.location.replace(redownloadUrl);

			const versionComment = '/* PrismJS ' + version + '\n' + redownloadUrl + ' */';

			for (const type in code) {
				(function (type) {
					const text = versionComment + '\n' + code[type];
					const fileName = 'prism.' + type;

					const codeElement = $('#download-' + type + ' code');
					const pre = codeElement.parentElement;

					const newCode = document.createElement('CODE');
					newCode.className = codeElement.className;
					newCode.textContent = text;

					Prism.highlightElement(newCode, true, () => {
						pre.replaceChild(newCode, codeElement);
					});


					$('#download-' + type + ' .download-button').onclick = function () {
						saveAs(new Blob([text], { type: 'application/octet-stream;charset=utf-8' }), fileName);
					};
				}(type));
			}
		});
	}

	/**
	 * Returns a promise of the code of the Prism bundle.
	 *
	 * @param {CodePromiseInfo[]} promises
	 * @returns {Promise<{ code: { js: string, css: string }, errors: HTMLElement[] }>}
	 *
	 * @typedef CodePromiseInfo
	 * @property {Promise} contentsPromise
	 * @property {string} id
	 * @property {string} category
	 * @property {string} path
	 * @property {string} type
	 */
	function buildCode(promises) {
		// sort the promises

		/** @type {CodePromiseInfo[]} */
		const finalPromises = [];
		/** @type {Object<string, CodePromiseInfo[]>} */
		const toSortMap = {};

		promises.forEach((p) => {
			if (p.category === 'core' || p.category === 'themes') {
				finalPromises.push(p);
			} else {
				let infos = toSortMap[p.id];
				if (!infos) {
					toSortMap[p.id] = infos = [];
				}
				infos.push(p);
			}
		});

		// this assumes that the ids in `toSortMap` are complete under transitive requirements
		getLoader(components, Object.keys(toSortMap)).getIds().forEach((id) => {
			if (!toSortMap[id]) {
				console.error(id + ' not found.');
			}
			finalPromises.push(...toSortMap[id]);
		});
		promises = finalPromises;

		// build
		let i = 0;
		const l = promises.length;
		const code = { js: '', css: '' };
		const errors = [];

		var f = function (resolve) {
			if (i < l) {
				const p = promises[i];
				p.contentsPromise.then((contents) => {
					code[p.type] += contents + (p.type === 'js' && !/;\s*$/.test(contents) ? ';' : '') + '\n';
					i++;
					f(resolve);
				});
				p.contentsPromise['catch'](() => {
					errors.push($u.element.create({
						tag: 'p',
						prop: {
							textContent: 'An error occurred while fetching the file "' + p.path + '".'
						}
					}));
					i++;
					f(resolve);
				});
			} else {
				resolve({ code, errors });
			}
		};

		return new Promise(f);
	}

	/**
	 * @returns {Promise<string>}
	 */
	function getVersion() {
		return getFileContents('./package.json').then((jsonStr) => {
			return JSON.parse(jsonStr).version;
		});
	}

}());
