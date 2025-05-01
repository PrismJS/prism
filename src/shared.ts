/**
 * This file defines the public API of Prism shared functionality.
 *
 * @file
 */

export { getLanguage, setLanguage, isActive } from './shared/dom-util';
export { extend, insertBefore } from './shared/language-util';
export { templating, embeddedIn } from './shared/languages/templating';
