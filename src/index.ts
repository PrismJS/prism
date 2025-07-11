// Auto Start runs on Global Prism and the re-exports it.
import globalPrism from './global';

export * from './core';
export { loadLanguages } from './load-languages';
export { PrismConfig } from './config';
export default globalPrism;
