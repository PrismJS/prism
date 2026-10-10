import Prism from './core/classes/prism.js';

export const hasDOM = typeof document !== 'undefined' && typeof window !== 'undefined';
const scriptElement = hasDOM ? document.currentScript : null;

/**
 * @type {GlobalConfig}
 */
const globalConfig =
	typeof globalThis.Prism === 'object' && !Prism.isPrism(globalThis.Prism)
		? (globalThis.Prism ?? {})
		: {};

/**
 * @param {string} name
 */
function getGlobalSetting (name) {
	// eslint-disable-next-line regexp/no-unused-capturing-group
	const camelCaseName = name.replace(/-([a-z])/g, g => g[1].toUpperCase());

	if (camelCaseName in globalConfig) {
		return globalConfig[camelCaseName];
	}
	else if (name in globalConfig) {
		return globalConfig[name];
	}
	else if (hasDOM) {
		return (
			scriptElement?.dataset[camelCaseName] ??
			document.querySelector(`[data-prism-${name}]`)?.getAttribute(`data-prism-${name}`)
		);
	}
}

/**
 * @param {string} name
 * @param {boolean} defaultValue
 * @returns {boolean}
 */
function getGlobalBooleanSetting (name, defaultValue) {
	const value = getGlobalSetting(name);

	if (value === null || value === undefined) {
		return defaultValue;
	}

	return !(value === false || value === 'false');
}

/**
 * @param {string} name
 * @returns {string[]}
 */
function getGlobalArraySetting (name) {
	const value = getGlobalSetting(name);
	if (value === null || value === undefined || value === false || value === 'false') {
		return [];
	}
	else if (typeof value === 'string') {
		return value.split(',').map(s => s.trim());
	}
	else if (Array.isArray(value)) {
		return value;
	}

	return [];
}

/**
 * Whether the auto-start entry (`prismjs` and the IIFE build) leaves highlighting the page to the user.
 */
export const manual = getGlobalBooleanSetting('manual', !hasDOM);

/**
 * @type {PrismConfig}
 */
export const globalDefaults = {
	silent: getGlobalBooleanSetting('silent', false),
	languages: getGlobalArraySetting('languages'),
	plugins: getGlobalArraySetting('plugins'),
	languagePath: /** @type {string | undefined} */ (getGlobalSetting('language-path')),
	pluginPath: /** @type {string | undefined} */ (getGlobalSetting('plugin-path')),
};

export default globalDefaults;

/**
 * @import { PrismConfig, GlobalConfig } from './types.d.ts';
 */
