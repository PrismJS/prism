import { register } from 'node:module';

// The version of this copy of Prism comes from the command line, e.g. `node iife-reused.js 2.0.0 2.1.0`.
// Only modules loaded after this one runs see it, so a fixture loads the source with `import()`.
// Static imports in the same fixture load before it runs
register('./version-hooks.js', import.meta.url, { data: process.argv[2] });
