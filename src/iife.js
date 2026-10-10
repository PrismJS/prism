import prism from './auto-start.js';
import Prism from './core/classes/prism.js';

// Rollup's `name` turns this export into `var Prism = …`, which sets the global.
// Next to another major version, `globalThis.Prism` holds that version's instance, so the export keeps it there.
// In a worker, `core/prism.js` sets no global without a DOM, so the export is the only source of `Prism` there
export default Prism.isPrism(globalThis.Prism) ? globalThis.Prism : prism;
