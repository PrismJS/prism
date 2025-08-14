const currentScript = /** @type {HTMLScriptElement | null} */ (globalThis.document?.currentScript);
if (currentScript) {
	// In browser and imported via non-ESM
	const url = new URL('./index.js', currentScript.src);

	import(url.toString()).then(({ default: prism }) => (globalThis.Prism = prism));
}
