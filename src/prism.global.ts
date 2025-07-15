// In browser and imported via non-ESM
const url = new URL('./index.js', (globalThis.document.currentScript as HTMLScriptElement).src);

void import(url.toString()).then(({ default: prism }) => ((globalThis as any).Prism = prism));
