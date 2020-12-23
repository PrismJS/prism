(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.createElement) {
		return;
	}

	/**
	 * Inverts the given object making all values keys and all keys values.
	 *
	 * This essential changes the direction of all edges in the directed graph described by the given record.
	 *
	 * @param {Object<string, string | string[]>} rec
	 * @returns {Object<string, string[]>}
	 */
	function invertRecord(rec) {
		/** @type {Object<string, string[]>} */
		var inv = {};
		/**
		 * @param {string} recKey
		 * @param {string} recValue
		 */
		function add(recKey, recValue) {
			(inv[recValue] = inv[recValue] || []).push(recKey);
		}
		for (var key in rec) {
			var value = rec[key];
			if (Array.isArray(value)) {
				value.forEach(function (v) { add(key, v); });
			} else {
				add(key, value);
			}
		}
		return inv;
	}

	/**
	 * The dependencies map is built automatically with gulp.
	 */
	var lang_dependencies = /*dependencies_placeholder[*/invertRecord({
		"clike": [
			"javascript",
			"apex",
			"birb",
			"c",
			"csharp",
			"d",
			"dart",
			"fsharp",
			"firestore-security-rules",
			"gml",
			"go",
			"groovy",
			"haxe",
			"java",
			"jolie",
			"kotlin",
			"latte",
			"nginx",
			"processing",
			"protobuf",
			"purebasic",
			"qore",
			"reason",
			"ruby",
			"solidity",
			"sqf",
			"swift",
			"tt2",
			"vala"
		],
		"javascript": [
			"actionscript",
			"coffeescript",
			"ejs",
			"flow",
			"jsdoc",
			"js-extras",
			"js-templates",
			"mongodb",
			"n4js",
			"pug",
			"qml",
			"jsx",
			"typescript"
		],
		"sql": [
			"apex",
			"plsql"
		],
		"cpp": "arduino",
		"markup": [
			"aspnet",
			"javadoc",
			"markdown",
			"markup-templating",
			"parser",
			"pug",
			"jsx",
			"textile",
			"twig",
			"velocity",
			"wiki",
			"xeora",
			"xml-doc",
			"xquery"
		],
		"csharp": [
			"aspnet",
			"t4-cs"
		],
		"c": [
			"bison",
			"cpp",
			"glsl",
			"hlsl",
			"objectivec",
			"opencl"
		],
		"ruby": [
			"crystal",
			"erb",
			"haml"
		],
		"css": [
			"css-extras",
			"less",
			"sass",
			"scss"
		],
		"markup-templating": [
			"django",
			"ejs",
			"etlua",
			"erb",
			"ftl",
			"handlebars",
			"latte",
			"php",
			"smarty",
			"soy",
			"tt2"
		],
		"lua": "etlua",
		"java": [
			"javadoc",
			"scala"
		],
		"javadoclike": [
			"javadoc",
			"jsdoc",
			"phpdoc"
		],
		"typescript": [
			"jsdoc",
			"tsx"
		],
		"json": [
			"json5",
			"jsonp"
		],
		"php": [
			"latte",
			"phpdoc",
			"php-extras"
		],
		"scheme": [
			"lilypond",
			"racket"
		],
		"haskell": "purescript",
		"jsx": "tsx",
		"bash": "shell-session",
		"turtle": "sparql",
		"t4-templating": [
			"t4-cs",
			"t4-vb"
		],
		"vbnet": "t4-vb",
		"yaml": "tap",
		"basic": "vbnet"
	})/*]*/;

	/**
	 * The map of all language aliases is built automatically with gulp.
	 */
	var lang_aliases = /*aliases_placeholder[*/invertRecord({
		"markup": [
			"html",
			"xml",
			"svg",
			"mathml",
			"ssml",
			"atom",
			"rss"
		],
		"javascript": "js",
		"antlr4": "g4",
		"asciidoc": "adoc",
		"bash": "shell",
		"bbcode": "shortcode",
		"bnf": "rbnf",
		"bsl": "oscript",
		"csharp": [
			"cs",
			"dotnet"
		],
		"coffeescript": "coffee",
		"concurnas": "conc",
		"django": "jinja2",
		"dns-zone-file": "dns-zone",
		"docker": "dockerfile",
		"ejs": "eta",
		"excel-formula": [
			"xlsx",
			"xls"
		],
		"gml": "gamemakerlanguage",
		"haskell": "hs",
		"ignore": [
			"gitignore",
			"hgignore",
			"npmignore"
		],
		"json": "webmanifest",
		"kotlin": [
			"kt",
			"kts"
		],
		"latex": [
			"tex",
			"context"
		],
		"lilypond": "ly",
		"lisp": [
			"emacs",
			"elisp",
			"emacs-lisp"
		],
		"markdown": "md",
		"moonscript": "moon",
		"n4js": "n4jsd",
		"naniscript": "nani",
		"objectivec": "objc",
		"pascal": "objectpascal",
		"pcaxis": "px",
		"peoplecode": "pcode",
		"powerquery": [
			"pq",
			"mscript"
		],
		"purebasic": "pbfasm",
		"purescript": "purs",
		"python": "py",
		"racket": "rkt",
		"renpy": "rpy",
		"robotframework": "robot",
		"ruby": "rb",
		"shell-session": [
			"sh-session",
			"shellsession"
		],
		"sml": "smlnj",
		"solidity": "sol",
		"solution-file": "sln",
		"sparql": "rq",
		"t4-cs": "t4",
		"turtle": "trig",
		"typescript": "ts",
		"typoscript": "tsconfig",
		"unrealscript": [
			"uscript",
			"uc"
		],
		"visual-basic": [
			"vb",
			"vba"
		],
		"xeora": "xeoracube",
		"yaml": "yml"
	})/*]*/;

	/**
	 * If the given language is an alias of another language, this will return aliases language. Otherwise, the given
	 * language itself will be returned.
	 *
	 * @param {string} lang
	 * @returns {string}
	 */
	function resolveAlias(lang) {
		if (lang_aliases[lang]) {
			return lang_aliases[lang][0];
		} else {
			return lang;
		}
	}

	/**
	 * @typedef LangDataItem
	 * @property {{ success?: () => void, error?: () => void }[]} callbacks
	 * @property {boolean} [error]
	 * @property {boolean} [loading]
	 */
	/** @type {Object<string, LangDataItem>} */
	var lang_data = {};

	var ignored_language = 'none';
	var languages_path = 'components/';

	var script = Prism.util.currentScript();
	if (script) {
		var autoloaderFile = /\bplugins\/autoloader\/prism-autoloader\.(?:min\.)?js(?:\?[^\r\n/]*)?$/i;
		var prismFile = /(^|\/)[\w-]+\.(?:min\.)?js(?:\?[^\r\n/]*)?$/i;

		var autoloaderPath = script.getAttribute('data-autoloader-path');
		if (autoloaderPath != null) {
			// data-autoloader-path is set, so just use it
			languages_path = autoloaderPath.trim().replace(/\/?$/, '/');
		} else {
			var src = script.src;
			if (autoloaderFile.test(src)) {
				// the script is the original autoloader script in the usual Prism project structure
				languages_path = src.replace(autoloaderFile, 'components/');
			} else if (prismFile.test(src)) {
				// the script is part of a bundle like a custom prism.js from the download page
				languages_path = src.replace(prismFile, '$1components/');
			}
		}
	}

	var config = Prism.plugins.autoloader = {
		languages_path: languages_path,
		use_minified: true,
		loadLanguages: loadLanguages
	};


	/**
	 * Lazily loads an external script.
	 *
	 * @param {string} src
	 * @param {() => void} [success]
	 * @param {() => void} [error]
	 */
	function addScript(src, success, error) {
		var s = document.createElement('script');
		s.src = src;
		s.async = true;
		s.onload = function () {
			document.body.removeChild(s);
			success && success();
		};
		s.onerror = function () {
			document.body.removeChild(s);
			error && error();
		};
		document.body.appendChild(s);
	}

	/**
	 * Returns all additional dependencies of the given element defined by the `data-dependencies` attribute.
	 *
	 * @param {Element} element
	 * @returns {string[]}
	 */
	function getDependencies(element) {
		var deps = (element.getAttribute('data-dependencies') || '').trim();
		if (!deps) {
			var parent = element.parentElement;
			if (parent && parent.tagName.toLowerCase() === 'pre') {
				deps = (parent.getAttribute('data-dependencies') || '').trim();
			}
		}
		return deps ? deps.split(/\s*,\s*/g) : [];
	}

	/**
	 * Returns whether the given language is currently loaded.
	 *
	 * @param {string} lang
	 * @returns {boolean}
	 */
	function isLoaded(lang) {
		if (lang.indexOf('!') >= 0) {
			// forced reload
			return false;
		}

		lang = resolveAlias(lang);

		if (lang in Prism.languages) {
			// the given language is already loaded
			return true;
		}

		// this will catch extensions like CSS extras that don't add a grammar to Prism.languages
		var data = lang_data[lang];
		return data && !data.error && data.loading === false;
	}

	/**
	 * Returns the path to a grammar, using the language_path and use_minified config keys.
	 *
	 * @param {string} lang
	 * @returns {string}
	 */
	function getLanguagePath(lang) {
		return config.languages_path + 'prism-' + lang + (config.use_minified ? '.min' : '') + '.js'
	}

	/**
	 * Loads all given grammars concurrently.
	 *
	 * @param {string[]|string} languages
	 * @param {(languages: string[]) => void} [success]
	 * @param {(language: string) => void} [error] This callback will be invoked on the first language to fail.
	 */
	function loadLanguages(languages, success, error) {
		if (typeof languages === 'string') {
			languages = [languages];
		}

		var total = languages.length;
		var completed = 0;
		var failed = false;

		if (total === 0) {
			if (success) {
				setTimeout(success, 0);
			}
			return;
		}

		function successCallback() {
			if (failed) {
				return;
			}
			completed++;
			if (completed === total) {
				success && success(languages);
			}
		}

		languages.forEach(function (lang) {
			loadLanguage(lang, successCallback, function () {
				if (failed) {
					return;
				}
				failed = true;
				error && error(lang);
			});
		});
	}

	/**
	 * Loads a grammar with its dependencies.
	 *
	 * @param {string} lang
	 * @param {() => void} [success]
	 * @param {() => void} [error]
	 */
	function loadLanguage(lang, success, error) {
		var force = lang.indexOf('!') >= 0;

		lang = lang.replace('!', '');
		lang = resolveAlias(lang);

		function load() {
			var data = lang_data[lang];
			if (!data) {
				data = lang_data[lang] = {
					callbacks: []
				};
			}
			data.callbacks.push({
				success: success,
				error: error
			});

			if (!force && isLoaded(lang)) {
				// the language is already loaded and we aren't forced to reload
				languageCallback(lang, 'success');
			} else if (!force && data.error) {
				// the language failed to load before and we don't reload
				languageCallback(lang, 'error');
			} else if (force || !data.loading) {
				// the language isn't currently loading and/or we are forced to reload
				data.loading = true;
				data.error = false;

				addScript(getLanguagePath(lang), function () {
					data.loading = false;
					languageCallback(lang, 'success');

				}, function () {
					data.loading = false;
					data.error = true;
					languageCallback(lang, 'error');
				});
			}
		};

		var dependencies = lang_dependencies[lang];
		if (dependencies && dependencies.length) {
			loadLanguages(dependencies, load, error);
		} else {
			load();
		}
	}

	/**
	 * Runs all callbacks of the given type for the given language.
	 *
	 * @param {string} lang
	 * @param {"success" | "error"} type
	 */
	function languageCallback(lang, type) {
		if (lang_data[lang]) {
			var callbacks = lang_data[lang].callbacks;
			for (var i = 0, l = callbacks.length; i < l; i++) {
				var callback = callbacks[i][type];
				if (callback) {
					setTimeout(callback, 0);
				}
			}
			callbacks.length = 0;
		}
	}

	Prism.hooks.add('complete', function (env) {
		var element = env.element;
		var language = env.language;
		if (!element || !language || language === ignored_language) {
			return;
		}

		var deps = getDependencies(element);
		if (/^diff-./i.test(language)) {
			// the "diff-xxxx" format is used by the Diff Highlight plugin
			deps.push('diff');
			deps.push(language.substr('diff-'.length));
		} else {
			deps.push(language);
		}

		if (!deps.every(isLoaded)) {
			// the language or some dependencies aren't loaded
			loadLanguages(deps, function () {
				Prism.highlightElement(element);
			});
		}
	});

}());
