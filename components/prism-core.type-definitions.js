/**
 * The expansion of a simple `RegExp` literal to support additional properties.
 *
 * @typedef TokenObject
 * @property {RegExp} pattern The regular expression of the token.
 * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
 * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the token.
 * @property {boolean} [greedy=false] Whether the token is greedy.
 * @property {string|string[]} [alias] An optional alias or list of aliases.
 * @property {Grammar} [inside] The nested tokens of this token.
*/

/**
 * @typedef Grammar
 * @type {Object.<string, RegExp | TokenObject | Array.<RegExp | TokenObject>>}
 * @property {Grammar} [rest] An optional grammar object that will appended to this grammar.
 */

/**
 * @callback HighlightCallback
 * @param {HTMLElement} element The element successfully highlighted.
 * @returns {void}
 * @memberof Prism
*/

/**
 * @callback HookCallback
 * @param {Object.<string, any>} env The environment variables of the hook.
 * @returns {void}
 * @memberof Prism.hooks
 */
