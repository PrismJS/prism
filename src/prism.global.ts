// In browser and imported via non-ESM
import('./index.js').then(({ default: prism }) => ((globalThis as any).Prism = prism));
