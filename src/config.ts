const hasDOM = typeof document !== 'undefined' && typeof window !== 'undefined';
const scriptElement: HTMLScriptElement = hasDOM && document.currentScript;
// @ts-ignore
const globalConfig: Record<string, PrismConfig[keyof PrismConfig]> =
	globalThis.Prism?.constructor?.name === 'Object' ? globalThis.Prism : {};

function getGlobalSetting (name: string) {
	let camelCaseName = name.replace(/-([a-z])/g, g => g[1].toUpperCase());

	if (camelCaseName in globalConfig) {
		return globalConfig[camelCaseName];
	}
	else if (name in globalConfig) {
		return globalConfig[name];
	}
	else if (hasDOM) {
		return (
			scriptElement.dataset[camelCaseName] ??
			document.querySelector(`[data-prism-${name}]`)?.getAttribute(`data-prism-${name}`)
		);
	}
}

function getGlobalBooleanSetting (name: string, defaultValue: boolean): boolean {
	const value = getGlobalSetting(name);

	if (value === null || value === undefined) {
		return defaultValue;
	}

	return !(value === false || value === 'false');
}

function getGlobalArraySetting (name: string): string[] {
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

export interface PrismConfig {
	manual?: boolean;
	plugins?: string[];
	languages?: string[];
	pluginPath?: string;
	languagePath?: string;
}

export const globalDefaults: PrismConfig = {
	manual: getGlobalBooleanSetting('manual', !hasDOM),
	languages: getGlobalArraySetting('languages'),
	plugins: getGlobalArraySetting('plugins'),
	languagePath: getGlobalSetting('language-path') ?? './languages/',
	pluginPath: getGlobalSetting('plugin-path') ?? './plugins/',
};

export default globalDefaults;
