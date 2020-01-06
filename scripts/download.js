/**
 * Manage downloads
 */

/// <reference path="utopia.js" />
/// <reference path="code.js" />
/// <reference path="../components.js" />
/// <reference path="../dependencies.js" />
/// <reference path="../prism.js" />
/// <reference path="vendor/FileSaver.min.js" />
/// <reference path="vendor/promise.js" />

(function() {

var cache = {};
var form = $('form');
var minified = true;

var dependencies = {};

var treeURL = 'https://api.github.com/repos/PrismJS/prism/git/trees/master?recursive=1';
var treePromise = new Promise(function(resolve) {
	$u.xhr({
		url: treeURL,
		callback: function(xhr) {
			if (xhr.status < 400) {
				resolve(JSON.parse(xhr.responseText).tree);
			}
		}
	});
});

var options = getOptions();

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

var hstr = window.location.hash.match(/(?:languages|plugins)=[-+\w]+|themes=[-\w]+/g);
if (hstr) {
	hstr.forEach(function(str) {
		var kv = str.split('=', 2),
		    category = kv[0],
		    ids = kv[1].split('+');
		if (category !== 'meta' && category !== 'core' && components[category]) {
			for (var id in components[category]) {
				if (components[category][id].option) {
					delete components[category][id].option;
				}
			}
			if (category === 'themes' && ids.length) {
				var themeInput = $('#theme input[value="' + ids[0] + '"]');
				if (themeInput) {
					themeInput.checked = true;
				}
				setTheme(ids[0]);
			}
			var makeDefault = function (id) {
				if (id !== 'meta') {
					if (components[category][id]) {
						if (components[category][id].option !== 'default') {
							if (typeof components[category][id] === 'string') {
								components[category][id] = { title: components[category][id] }
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
// options
var optHStr = window.location.hash.match(/(options-[\w-]+)\.([\w-]+)=([^?&]*)/g);
if (optHStr) {
	optHStr.forEach(function (m) {
		var match = /(options-[\w-]+)\.([\w-]+)=([^?&]*)/.exec(m);
		if (match) {
			var optionId = match[1];
			var itemName = match[2];
			var value = decodeURIComponent(match[3]);

			var set = false;
			options.forEach(function (o) {
				if (!set && o.id === optionId) {
					for (var name in o.items) {
						if (name === itemName && o.items.hasOwnProperty(name)) {
							var item = o.items[name];
							if (item.type === 'boolean') {
								value = value === 'true';
							} else if (item.type === 'number') {
								value = Number(value);
							}

							if (item.validate(value)) {
								// invalid ignore
								console.warn('Invalid value: ' + m);
							} else {
								item.value = value;
							}
							set = true;
						}
					}
				}
			});

			if (!set) {
				console.warn('Unknown option: ' + m);
			}
		}
	});
}

// add options to the DOM
var updateOptions = addOptionsToDOM(options);

// Stay compatible with old querystring feature
var qstr = window.location.search.match(/(?:languages|plugins)=[-+\w]+|themes=[-\w]+/g);
if (qstr && !hstr) {
	window.location.hash = window.location.search.replace(/^\?/, '');
	window.location.search = '';
}

var storedTheme = localStorage.getItem('theme');

for (var category in components) {
	var all = components[category];

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
						onclick: (function(category, all){
							return function () {
								var checkAll = this;
								$$('input[name="download-' + category + '"]').forEach(function(input) {
									all[input.value].enabled = input.checked = checkAll.checked;
								});

								update(category);
							};
						})(category, all)
					}
				},
				'Select/unselect all'
			],
			inside: all.meta.section
		});
	}

	for (var id in all) {
		if(id === 'meta') {
			continue;
		}

		var checked = false, disabled = false;
		var option = all[id].option || all.meta.option;

		switch (option) {
			case 'mandatory': disabled = true; // fallthrough
			case 'default': checked = true;
		}
		if (category === 'themes' && storedTheme) {
			checked = id === storedTheme;
		}

		var filepath = all.meta.path.replace(/\{id}/g, id);

		var info = all[id] = {
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

		info.require.forEach(function (v) {
			dependencies[v] = (dependencies[v] || []).concat(id);
		});

		if (!all[id].noJS && !/\.css$/.test(filepath)) {
			info.files.minified.paths.push(filepath.replace(/(\.js)?$/, '.min.js'));
			info.files.dev.paths.push(filepath.replace(/(\.js)?$/, '.js'));
		}


		if ((!all[id].noCSS && !/\.js$/.test(filepath)) || /\.css$/.test(filepath)) {
			var cssFile = filepath.replace(/(\.css)?$/, '.css');

			info.files.minified.paths.push(cssFile);
			info.files.dev.paths.push(cssFile);
		}

		function getLanguageTitle(lang) {
			if (!lang.aliasTitles)
				return lang.title;

			var titles = [lang.title];
			for (var alias in lang.aliasTitles)
				if (lang.aliasTitles.hasOwnProperty(alias))
					titles.push(lang.aliasTitles[alias]);
			return titles.join(" + ");
		}

		var label = $u.element.create('label', {
			attributes: {
				'data-id': id
			},
			contents: [
				{
					tag: 'input',
					properties: {
						type: all.meta.exclusive? 'radio' : 'checkbox',
						name: 'download-' + category,
						value: id,
						checked: checked,
						disabled: disabled,
						onclick: (function(id, category, all){
							return function () {
								$$('input[name="' + this.name + '"]').forEach(function(input) {
									all[input.value].enabled = input.checked;
								});

								if (all[id].require && this.checked) {
									all[id].require.forEach(function(v) {
										var input = $('label[data-id="' + v + '"] > input');
										input.checked = true;

										input.onclick();
									});
								}

								if (dependencies[id] && !this.checked) { // It’s required by others
									dependencies[id].forEach(function(dependent) {
										var input = $('label[data-id="' + dependent + '"] > input');
										input.checked = false;

										input.onclick();
									});
								}

								update(category, id);
							};
						})(id, category, all)
					}
				},
				all.meta.link? {
					tag: 'a',
					properties: {
						href: all.meta.link.replace(/\{id}/g, id),
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
				all[id].owner? {
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
				var themeInput = $('#theme input[value="' + id + '"]');
				var input = $('input', label);
				if (themeInput) {
					var themeInputOnclick = themeInput.onclick;
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
form.elements.compression[1].onclick = function() {
	minified = !!+this.value;

	getFilesSizes();
};

function getFileSize(filepath) {
	return treePromise.then(function(tree) {
		for(var i=0, l=tree.length; i<l; i++) {
			if(tree[i].path === filepath) {
				return tree[i].size;
			}
		}
	});
}

function getFilesSizes() {
	for (var category in components) {
		var all = components[category];

		for (var id in all) {
			if(id === 'meta') {
				continue;
			}

			var distro = all[id].files[minified? 'minified' : 'dev'],
			    files = distro.paths;

			files.forEach(function (filepath) {
				var file = cache[filepath] = cache[filepath] || {};

				if(!file.size) {

					(function(category, id) {
					getFileSize(filepath).then(function(size) {
						if(size) {
							file.size = size;
							distro.size += file.size;

							update(category, id);
						}
					});
					}(category, id));
				}
				else {
					update(category, id);
				}
			});
		}
	}
}

getFilesSizes();

function getFileContents(filepath) {
	return new Promise(function(resolve, reject) {
		$u.xhr({
			url: filepath,
			callback: function(xhr) {
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
	return Math.round(100 * size / 1024)/100 + 'KB';
}

function update(updatedCategory, updatedId){
	// Update total size
	var total = {js: 0, css: 0}, updated = {js: 0, css: 0};

	for (var category in components) {
		var all = components[category];
		var allChecked = true;

		for (var id in all) {
			var info = all[id];

			if (info.enabled || id == updatedId) {
				var distro = info.files[minified? 'minified' : 'dev'];

				distro.paths.forEach(function(path) {
					if (cache[path]) {
						var file = cache[path];

						var type = path.match(/\.(\w+)$/)[1],
						    size = file.size || 0;

						if (info.enabled) {

							if (!file.contentsPromise) {
								file.contentsPromise = getFileContents(path);
							}

							total[type] += size;
						}

						if (id == updatedId) {
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
				var themeInput = $('#theme input[value="' + updatedId + '"]');
				if (themeInput) {
					themeInput.checked = true;
				}
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

	updateOptions();
	delayedGenerateCode();
}

var timerId = 0;
// "debounce" multiple rapid requests to generate and highlight code
function delayedGenerateCode(){
	if ( timerId !== 0 ) {
		clearTimeout(timerId);
	}
	timerId = setTimeout(generateCode, 500);
}

function generateCode(){
	/** @type {CodePromiseInfo[]} */
	var promises = [];

	for (var category in components) {
		for (var id in components[category]) {
			if (id === 'meta') {
				continue;
			}

			var info = components[category][id];
			if (info.enabled) {
				info.files[minified ? 'minified' : 'dev'].paths.forEach(function (path) {
					if (cache[path]) {
						var type = path.match(/\.(\w+)$/)[1];

						promises.push({
							contentsPromise: cache[path].contentsPromise,
							id: id,
							category: category,
							path: path,
							type: type
						});
					}
				});
			}
		}
	}

	// Hide error message if visible
	var error = $('#download .error');
	error.style.display = '';

	Promise.all([buildCode(promises), getVersion()]).then(function(arr) {
		var res = arr[0];
		var version = arr[1];
		var code = res.code;
		var errors = res.errors;

		if (errors.length) {
			error.style.display = 'block';
			error.innerHTML = '';
			$u.element.contents(error, errors);
		}

		var redownloadUrl = buildUrl();
		window.location.replace(redownloadUrl);

		var versionComment = "/* PrismJS " + version + "\n" + redownloadUrl + " */";

		options.filter(function (o) { return o.enabled; }).forEach(function (o) {
			code.js = o.applyJs(code.js);
			code.css = o.applyCss(code.css);
		});

		for (var type in code) {
			(function (type) {
				var text = versionComment + "\n" + code[type];
				var fileName = 'prism.' + type;

				var codeElement = $('#download-' + type + ' code');
				var pre = codeElement.parentElement;

				var newCode = document.createElement('CODE');
				newCode.className = codeElement.className;
				newCode.textContent = text;

				Prism.highlightElement(newCode, true, function () {
					pre.replaceChild(newCode, codeElement);
				});


				$('#download-' + type + ' .download-button').onclick = function () {
					saveAs(new Blob([text], { type: "application/octet-stream;charset=utf-8" }), fileName);
				};
			})(type);
		}
	});
}

function buildUrl() {
	var redownloadUrl = window.location.href.split("#")[0] + "#";

	var redownload = {};

	for (var category in components) {
		for (var id in components[category]) {
			if (category !== 'core' && id !== 'meta' && components[category][id].enabled) {
				redownload[category] = redownload[category] || [];
				redownload[category].push(id);
			}
		}
	}

	for (var category in redownload) {
		redownloadUrl += category + "=" + redownload[category].join('+') + "&";
	}

	options.forEach(function (o) {
		if (!o.enabled) {
			return;
		}

		for (var name in o.items) {
			if (o.items.hasOwnProperty(name)) {
				var item = o.items[name];
				if (item.value !== item.default) {
					redownloadUrl += o.id + '.' + name + '=' + encodeURIComponent(String(item.value)) + '&';
				}
			}
		}
	});

	return redownloadUrl.replace(/&$/, "");
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
	var finalPromises = [];
	/** @type {Object<string, CodePromiseInfo[]>} */
	var toSortMap = {};

	promises.forEach(function (p) {
		if (p.category == "core" || p.category == "themes") {
			finalPromises.push(p);
		} else {
			var infos = toSortMap[p.id];
			if (!infos) {
				toSortMap[p.id] = infos = [];
			}
			infos.push(p);
		}
	});

	// this assumes that the ids in `toSortMap` are complete under transitive requirements
	getLoader(components, Object.keys(toSortMap)).getIds().forEach(function (id) {
		if (!toSortMap[id]) {
			console.error(id + " not found.");
		}
		finalPromises.push.apply(finalPromises, toSortMap[id]);
	});
	promises = finalPromises;

	// build
	var i = 0,
	    l = promises.length;
	var code = {js: '', css: ''};
	var errors = [];

	var f = function(resolve) {
		if(i < l) {
			var p = promises[i];
			p.contentsPromise.then(function(contents) {
				code[p.type] += contents + (p.type === 'js' && !/;\s*$/.test(contents) ? ';' : '') + '\n';
				i++;
				f(resolve);
			});
			p.contentsPromise['catch'](function() {
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
			resolve({code: code, errors: errors});
		}
	};

	return new Promise(f);
}

/**
 * @returns {Promise<string>}
 */
function getVersion() {
	return getFileContents('./package.json').then(function (jsonStr) {
		return JSON.parse(jsonStr).version;
	});
}


/**
 * @returns {Option[]}
 *
 * @typedef Option
 * @property {string} id All ids have to start with `options-`.
 * @property {string} title
 * @property {string|string[]} [require]
 * @property {boolean} [enabled]
 * @property {Object<string, OptionItem>} items
 * @property {(this: Option, js: string) => string} [applyJs]
 * @property {(this: Option, css: string) => string} [applyCss]
 *
 * @typedef {StringOptionItem | NumberOptionItem | BooleanOptionItem} OptionItem
 *
 * @typedef StringOptionItem
 * @property {string} title
 * @property {"string"} type
 * @property {string} [value]
 * @property {string} [default='']
 * @property {(value: string, option: Option) => string | undefined} [validate]
 * @typedef NumberOptionItem
 * @property {string} title
 * @property {"number"} type
 * @property {number} [value]
 * @property {number} [default=0]
 * @property {(value: number, option: Option) => string | undefined} [validate]
 * @typedef BooleanOptionItem
 * @property {string} title
 * @property {"boolean"} type
 * @property {boolean} [value]
 * @property {boolean} [default=false]
 * @property {(value: boolean, option: Option) => string | undefined} [validate]
 */
function getOptions() {
	/**
	 * Note: The keys of items are used as their identifier and will be be used in the URL hash.
	 *
	 * CHANGING THE ITEM NAMES WILL BREAKING OLD URLS!
	 */

	/** @type {Option[]} */
	var opts = [
		{
			id: 'options-general',
			title: 'General',
			items: {
				manual: {
					title: 'Manual highlighting',
					type: 'boolean'
				}
			},
			applyJs: function (js) {
				if (this.items.manual.value) {
					return js + 'Prism.manual=true;\n';
				}
				return js;
			}
		},
		{
			id: 'options-custom-class',
			title: 'Custom Class',
			require: 'custom-class',
			items: {
				prefix: {
					title: 'Theme prefix',
					type: 'string',
					validate: matchRegExp(/^[\w-]*$/)
				}
			},
			applyJs: function (js) {
				var prefix = this.items.prefix.value;
				if (prefix) {
					return js + 'Prism.plugins.customClass.prefix(' + JSON.stringify(prefix) + ');\n';
				}
				return js;
			},
			applyCss: function (css) {
				var prefix = this.items.prefix.value;
				if (prefix) {
					var tokens = Prism.tokenize(css, Prism.languages.css);

					tokens.forEach(function (t) {
						if (t.type === 'selector') {
							var selector = stringify(t.content);

							selector = selector.replace(/[-\w.#:()]*\.token(?![-\w])[-\w.#:()]*/g, function (m) {
								return m.replace(/\.([\w-]+)/g, function (m, g1) {
									return '.' + prefix + g1;
								});
							});

							t.content = selector;
						}
					});

					/**
					 * @param {string | Token | Token[]} t
					 * @returns {string}
					 */
					function stringify(t) {
						if (typeof t === 'string') {
							return t;
						}
						if (Array.isArray(t)) {
							return t.map(stringify).join('');
						}
						return stringify(t.content);
					}

					css = stringify(tokens);
				}
				return css;
			}
		},
		{
			id: 'options-filter-highlight-all',
			title: 'Filter highlightAll',
			require: 'filter-highlight-all',
			items: {
				filterKnown: {
					title: 'Filter known',
					type: 'boolean'
				},
				filterSelector: {
					title: 'Filter CSS selector',
					type: 'string'
				},
				rejectSelector: {
					title: 'Reject CSS selector',
					type: 'string'
				}
			},
			applyJs: function (js) {
				if (this.items.filterKnown.value) {
					js += 'Prism.plugins.filterHighlightAll.filterKnown=true;\n';
				}
				var filterSelector = this.items.filterSelector.value;
				if (filterSelector) {
					js += 'Prism.plugins.filterHighlightAll.addSelector(' + JSON.stringify(filterSelector) + ');\n';
				}
				var rejectSelector = this.items.rejectSelector.value;
				if (rejectSelector) {
					js += 'Prism.plugins.filterHighlightAll.reject.addSelector(' + JSON.stringify(rejectSelector) + ');\n';
				}
				return js;
			}
		}
	];

	return opts.map(function setDefaultValues(o) {
		if (!/^options-/.test(o.id)) {
			throw new Error('Invalid id ' + o.id);
		}
		o.applyCss = o.applyCss || identifyFn;
		o.applyJs = o.applyJs || identifyFn;
		for (var name in o.items) {
			if (o.items.hasOwnProperty(name)) {
				if (!/^[\w-]+$/.test(name)) {
					throw new Error("Invalid name: " + name);
				}
				var element = o.items[name];
				element.validate = element.validate || voidFn;

				if (element.default == undefined) {
					if (element.type === 'boolean') {
						element.default = false;
					} else if (element.type === 'number') {
						element.default = 0;
					} else if (element.type === 'string') {
						element.default = '';
					}
				}

				if ('value' in element) {
					throw new Error('The "value" property cannot be defined here.');
				}
				element.value = element.default;

				if (element.validate(element.value)) {
					throw new Error('The default value of "' + name + '" has to be valid.');
				}
			}
		}
		return o;
	});

	function identifyFn(x) { return x; }
	function voidFn() { return undefined; }
	function matchRegExp(re) {
		return function (value) {
			if (!re.test(value)) {
				return 'The value must match the regular expression <code>' + text(re) + '</code>';
			}
		};
	}

	function text(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;');
	}
}

/**
 * Adds the given options to the DOM.
 *
 * @param {Option[]} options
 */
function addOptionsToDOM(options) {
	var container = $('#option-container');

	/** @type {{ option: Option, element: HTMLElement }[]} */
	var optionElementPairs = [];

	options.forEach(function (o) {
		var element = $u.element.create('div', {
			contents: [
				{
					tag: 'h3',
					contents: o.title
				},
				{
					tag: 'div',
					properties: {
						className: 'option-items'
					},
					contents: Object.keys(o.items).map(function (name) {
						var item = o.items[name];
						var errorId = o.id + '-' + name;

						function validate(value) {
							var message = item.validate(value, o);
							var errorElement = $('#' + errorId);
							if (message) {
								errorElement.innerHTML = message;
								errorElement.style.display = 'block';
							} else {
								item.value = value;
								errorElement.textContent = '';
								errorElement.style.display = 'none';
								delayedGenerateCode();
							}
						}

						var contents = [];
						if (item.type === 'boolean') {
							contents.push({
								tag: 'label',
								contents: [
									{
										tag: 'span',
										contents: item.title
									},
									{
										tag: 'input',
										properties: {
											type: 'checkbox',
											checked: item.value,
											onclick: function () { validate(this.checked); }
										}
									}
								]
							});
						} else {
							contents.push(
								{
									tag: 'span',
									contents: item.title
								},
								{
									tag: 'input',
									properties: {
										type: item.type === 'number' ? 'number' : 'text',
										value: item.value,
										oninput: function () { validate(this.value); }
									}
								}
							);
						}

						contents.push({
							tag: 'div',
							properties: {
								className: 'option-item-error',
								id: errorId
							}
						});
						return {
							tag: 'div',
							properties: {
								className: 'option-item'
							},
							contents: contents
						};
					})
				}
			],
			inside: container
		});

		optionElementPairs.push({
			option: o,
			element: element
		});
	});

	function updateOptions() {
		// check where the requirements of a option is met and therefore whether the option is active
		optionElementPairs.forEach(function (pair) {
			var option = pair.option;
			var element = pair.element;

			var enabled = toArray(option.require).every(function (id) {
				var comp = components.languages[id] || components.plugins[id];
				return comp && comp.enabled;
			});
			option.enabled = enabled;

			element.style.display = enabled ? 'block' : 'none';
		});
	}
	updateOptions();
	return updateOptions;
}


})();
