const hasDOM = typeof document !== 'undefined' && typeof window !== 'undefined';
const scriptElement = hasDOM ? document.currentScript : null;

/**
 * @type {GlobalConfig}
 */
const globalConfig = globalThis.Prism?.constructor?.name === 'Object' ? globalThis.Prism : {};

/**
 * @param {string} name
 * @returns {string | boolean | null | undefined}
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
 * @type {PrismConfig}
 */
export const globalDefaults = {
	manual: getGlobalBooleanSetting('manual', !hasDOM),
};

export default globalDefaults;

/**
 * @typedef {import('./types.d.ts').PrismConfig} PrismConfig
 * @typedef {import('./types.d.ts').GlobalConfig} GlobalConfig
 */
