/**
 * This file defines the public API of Prism shared functionality.
 */

export { getLanguage, setLanguage, isActive } from './shared/dom-util.js';
export { extend, insertBefore } from './util/language-util.js';
export { splitTokenStream, insertTokens } from './util/token-stream.js';
