import * as fs from 'node:fs';
import * as path from 'node:path';
 import * as url from 'url';
import { coreChecks } from './checks.js';
import { Prism } from '../../prism-core.js'
import { getLoader } from "../../dependencies.js"

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const components = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../components.json')))
const { languages: languagesCatalog, plugins: pluginsCatalog } = components;

const languageLoaders = new Map()
const pluginLoaders = new Map()

await Promise.allSettled(
	Object.keys(languagesCatalog).map(async (lang) => {
		const { loader } = await import(path.resolve(__dirname, `../../components/prism-${lang}.js`))
		if (!loader) {
			throw Error(`Missing 'export {loader}' for ${lang}`)
		}
		languageLoaders.set(lang, loader)
		return loader
	}),
)

await Promise.allSettled(Object.keys(pluginsCatalog).map(async (plugin) => {
	const {Plugin} = await import(path.resolve(__dirname, `../../plugins/${plugin}/prism-${plugin}.js`))
	if (!Plugin) {
		throw Error(`Missing 'export {Plugin}' for ${plugin}`)
	}
	pluginLoaders.set(plugin, Plugin)
	return Plugin
}))

/**
 * @typedef {import('../../components/prism-core')} Prism
 */

/**
	* Creates a new Prism instance with the given language(s) loaded
	*
	* @param {string|string[]} languages
	* @returns {import('../../components/prism-core')}
	*/
export function createInstance(languages) {
	const prism = this.createEmptyPrism()

	loadLanguages(prism, languages)

	return prism
}

export async function loadLanguages (prism, languages) {
	getLoader(components, toArray(languages)).load(id => {
		if (!languagesCatalog[id]) {
			throw new Error(`Language '${id}' not found.`);
		}

		languageLoaders.get(id)(prism, { force: true })
	});
}

export function loadPlugins (prism, plugins) {
	plugins = toArray(plugins)

	plugins.forEach((plugin) => {
		const Plugin = pluginLoaders.get(plugin)
		Plugin(prism)
	})
}

/**
	* Creates a new empty prism instance
	*
	* @private
	* @returns {Prism}
	*/
export function createEmptyPrism() {
	const PrismInstance = new Prism({ manual: false });
	coreChecks(PrismInstance);
	return PrismInstance;
}

/**
 * Wraps the given value in an array if it's not an array already.
 *
 * @param {T[] | T} value
 * @returns {T[]}
 * @template T
 */
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}