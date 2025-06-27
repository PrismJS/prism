const hasDOM = typeof document !== 'undefined' && typeof window !== 'undefined';
const scriptElement: HTMLOrSVGScriptElement | null = hasDOM ? document.currentScript : null;
const globalConfig: Record<string, PrismConfig[keyof PrismConfig] | null> =
	// @ts-ignore
	globalThis.Prism?.constructor?.name === 'Object' ? globalThis.Prism : {};

function getGlobalSetting (name: string) {
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

function getGlobalBooleanSetting (name: string, defaultValue: boolean): boolean {
	const value = getGlobalSetting(name);

	if (value === null || value === undefined) {
		return defaultValue;
	}

	return !(value === false || value === 'false');
}

export interface PrismConfig {
	manual?: boolean;
}

export const globalDefaults: PrismConfig = {
	manual: getGlobalBooleanSetting('manual', !hasDOM),
};

export default globalDefaults;
