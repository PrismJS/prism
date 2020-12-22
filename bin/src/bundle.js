const fs = require('fs');
const path = require('path');
const gzipSize = require('gzip-size');
const getLoader = require('../../dependencies');
const components = require('../../components.json');
const { version } = require('../../package.json');

const ALL_LANGUAGES = getIds('languages');
const ALL_PLUGINS = getIds('plugins');
const ALL_THEMES = getIds('themes');

const PROJECT_DIR = path.join(__dirname, '../..');
// The strange ";;" is to prevent webpack from including all those files into the build
const LANGUAGES_DIR = path.join(PROJECT_DIR, './components;;'.replace(/;;/, ''));
const PLUGINS_DIR = path.join(PROJECT_DIR, './plugins;;'.replace(/;;/, ''));
const THEMES_DIR = path.join(PROJECT_DIR, './themes;;'.replace(/;;/, ''));

module.exports = /** @type {import("yargs").CommandModule} */({
	command: 'bundle',
	describe: 'Create JS and CSS bundles for a specific configuration of languages/plugins/themes.',

	builder(yargs) {
		return yargs
			.option('config', {
				describe: 'The path of a JS/JSON configuration file that specifies the languages, plugins, and theme of the bundle.'
					+ ' The file has to have the following format:\n'
					+ [
						'| {',
						'|   // a list of languages (e.g. ["html", "php", "java"])',
						'|   languages?: "all" | string[],',
						'|   // a list of plugins (e.g. ["line-number", "toolbar"])',
						'|   plugins?: "all" | string[],',
						'|   // a theme id (e.g. "default", "coy")',
						'|   theme?: string,',
						'|   minified?: boolean,',
						'| }'
					].join('\n'),
				alias: 'c',
				type: 'string'
			})
			.option('languages', {
				describe: 'A list of languages to includes. Languages are separated by comma (e.g. html,php,java). '
					+ 'Use "--languages=all" to include all languages.',
				type: 'string'
			})
			.option('plugins', {
				describe: 'A list of plugins to includes. Plugins are separated by comma (e.g. line-numbers,toolbar).'
					+ ' Use "--plugins=all" to include all plugins.',
				type: 'string'
			})
			.option('theme', {
				describe: 'The name of the theme. If no theme is specified, Prism\'s default theme will be used.',
				type: 'string'
			})
			.option('minified', {
				describe: 'Whether languages and plugins should be minified.'
					+ ' Use --minified=false for development files.',
				default: true,
				type: 'boolean'
			})
			.option('js-out', {
				describe: 'The output JS file(s) of the generated bundle. Existing files will be overwritten.',
				normalize: true,
				type: 'array'
			})
			.option('css-out', {
				describe: 'The output CSS file(s) of the generated bundle. Existing files will be overwritten.',
				normalize: true,
				type: 'array'
			});
	},

	async handler(argv) {
		const config = argv.config;
		const languages = String(argv.languages || '');
		const plugins = String(argv.plugins || '');
		const theme = String(argv.theme || '');
		const minified = argv.minified;

		/** @type {string[]} */
		const jsOut = argv.jsOut || [];
		/** @type {string[]} */
		const cssOut = argv.cssOut || [];

		if (jsOut.length === 0 && cssOut.length === 0) {
			throw new Error('At least one --js-out or --css-out path has to be specified.');
		}

		/** @type {BundleOptions} */
		let options = {
			theme: 'default'
		};
		if (config) {
			const configOptions = require(path.join(process.cwd(), config));
			options = mergeBundleOptions(options, configOptions);
		}
		options = mergeBundleOptions(options, {
			languages: languages === 'all' ? 'all' : languages.split(/\s*,\s*/g).filter(Boolean),
			plugins: plugins === 'all' ? 'all' : plugins.split(/\s*,\s*/g).filter(Boolean),
			theme,
			minified
		});

		let header = `/* PrismJS ${version}\n * $ npx ${bundleOptionsToCommand(options)}\n */`;

		let { js, css } = bundle(options);
		js = header + '\n' + js;
		css = header + '\n' + css;

		console.log(`JS:\t${formatBytes(js.length).padStart(10)} ${formatBytes(await gzipSize(js)).padStart(10)} (gzip)`);
		console.log(`CSS:\t${formatBytes(css.length).padStart(10)} ${formatBytes(await gzipSize(css)).padStart(10)} (gzip)`);

		for (const path of jsOut) {
			fs.writeFileSync(path, js, 'utf-8');
		}
		for (const path of cssOut) {
			fs.writeFileSync(path, css, 'utf-8');
		}
	}
});

/**
 * @typedef BundleOptions
 * @property {IdList} [languages]
 * @property {IdList} [plugins]
 * @property {string} [theme]
 * @property {boolean} [minified]
 *
 * @typedef Bundle
 * @property {string} js
 * @property {string} css
 *
 * @typedef {"all" | string[] | undefined} IdList
 */

/**
 * @param {Readonly<BundleOptions>} base
 * @param {Readonly<BundleOptions>} overwrite
 * @returns {BundleOptions}
 */
function mergeBundleOptions(base, overwrite) {
	/**
	 * @param {IdList} a
	 * @param {IdList} b
	 * @returns {IdList}
	 */
	function mergeList(a, b) {
		if (!a) {
			return b;
		} else if (!b) {
			return a;
		}
		if (a === 'all' || b === 'all') {
			return 'all';
		}
		return [...a, ...b];
	}

	return {
		languages: mergeList(base.languages, overwrite.languages),
		plugins: mergeList(base.plugins, overwrite.plugins),
		theme: overwrite.theme || base.theme,
		minified: overwrite.minified != undefined ? overwrite.minified : base.minified,
	};
}

/**
 * @param {Readonly<BundleOptions>} options
 * @returns {string}
 */
function bundleOptionsToCommand(options) {
	const parts = [
		'prismjs',
		'bundle'
	];

	/**
	 * @param {IdList} list
	 * @returns {string}
	 */
	function listToString(list) {
		if (list === 'all') {
			return 'all'
		} else if (list && list.length > 0) {
			return list.join(',');
		} else {
			return '';
		}
	}

	let languages = listToString(options.languages);
	if (languages) {
		parts.push(`--languages=${languages}`);
	}
	let plugins = listToString(options.plugins);
	if (plugins) {
		parts.push(`--plugins=${plugins}`);
	}
	if (options.theme) {
		parts.push(`--theme=${options.theme}`);
	}
	parts.push(`--minified=${options.minified == undefined ? true : options.minified}`);

	return parts.join(' ');
}

/**
 * @param {Readonly<BundleOptions>} options
 * @returns {Bundle}
 */
function bundle(options) {
	const languages = options.languages === 'all' ? ALL_LANGUAGES : (options.languages || []);
	const plugins = options.plugins === 'all' ? ALL_PLUGINS : (options.plugins || []);
	let theme = options.theme || 'default';

	// check languages
	for (const id of languages) {
		if (ALL_LANGUAGES.indexOf(id) === -1) {
			throw new Error(`Unknown language "${id}".`);
		}
	}
	// check plugins
	for (const id of plugins) {
		if (ALL_PLUGINS.indexOf(id) === -1) {
			throw new Error(`Unknown plugin "${id}".`);
		}
	}
	// check theme
	if (theme === 'default' || theme === 'prism') {
		theme = 'prism';
	} else {
		theme = `prism-${theme}`;
		if (ALL_THEMES.indexOf(theme) === -1) {
			throw new Error(`Unknown theme "${options.theme}".`);
		}
	}

	const ext = options.minified ? '.min.js' : '.js';

	let js = fs.readFileSync(path.join(PROJECT_DIR, 'components/prism-core' + ext), 'utf-8');
	let css = fs.readFileSync(path.join(THEMES_DIR, `${theme}.css`), 'utf-8');

	const appendJS = (code) => js = js.replace(/;\s*$/, ';\n') + code.trim();
	const appendCSS = (code) => css += '\n\n' + code.trim();

	const loadOrder = getLoader(/** @type {any} */(components), [...languages, ...plugins]).getIds();
	for (const id of loadOrder) {
		if (id in components.languages) {
			// language
			appendJS(fs.readFileSync(path.join(LANGUAGES_DIR, `prism-${id}${ext}`), 'utf-8'));
		} else {
			// plugin
			appendJS(fs.readFileSync(path.join(PLUGINS_DIR, `${id}/prism-${id}${ext}`), 'utf-8'));
			if (!components.plugins[id].noCSS) {
				appendCSS(fs.readFileSync(path.join(PLUGINS_DIR, `${id}/prism-${id}.css`), 'utf-8'));
			}
		}
	}

	console.log(`Bundled ${loadOrder.length + 1} components (including dependencies and core)`);

	return { js, css };
}

/**
 * @param {keyof typeof components} category
 */
function getIds(category) {
	const entries = components[category];
	const ids = Object.keys(entries).filter(id => id !== 'meta');

	for (const id of [...ids]) {
		const alias = entries[id].alias;
		if (Array.isArray(alias)) {
			ids.push(...alias);
		} else if (alias) {
			ids.push(alias);
		}
	}

	return ids;
}

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(bytes, decimals = 2) {
	if (bytes === 0) return '0 Bytes';

	const sign = bytes < 0 ? '-' : '';
	bytes = Math.abs(bytes);

	const k = 1000;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return sign + parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
