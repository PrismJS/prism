/**
 * This file defines the public API of Prism shared functionality.
 *
 * @file
 */

export { getLanguage, setLanguage, isActive } from './shared/dom-util.js';
export { extend, insertBefore } from './shared/language-util.js';
export { rest, tokenize } from './shared/symbols.js';
export { templating, embeddedIn } from './shared/languages/templating.js';
