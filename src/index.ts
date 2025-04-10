// Auto Start runs on Global Prism and the re-exports it.
import globalPrism from './auto-start';

export * from './core';
export { loadLanguages } from './load-languages';
export { PrismConfig } from './auto-start';
export default globalPrism;
