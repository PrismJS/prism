// Auto Start runs on Global Prism and the re-exports it.
import globalPrism from './auto-start.js';

export * from './core.js';
export { loadLanguages } from './load-languages.js';
export default globalPrism;
