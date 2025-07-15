const currentScript = globalThis.document?.currentScript as HTMLScriptElement;
if (currentScript) {
	// In browser and imported via non-ESM
	const url = new URL('./index.js', currentScript.src);

	void import(url.toString()).then(({ default: prism }) => ((globalThis as any).Prism = prism));
}
