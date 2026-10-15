import prism from '../../global.js';
import { isActive } from '../../shared/dom-util.js';

/**
 *
 * @param {ChildNode} child
 * @returns {child is Element}
 */
function isElement (child) {
	return child.nodeType === 1;
}

/**
 *
 * @param {ChildNode} child
 * @returns {child is Text}
 */
function isText (child) {
	return child.nodeType === 3;
}

/**
 * The keep-markup ancestor this node was recorded under, if that ancestor
 * has already been put back in the highlighted tree.
 *
 * @param {NodeData} node
 * @returns {Element | undefined}
 */
function insertedKeepParent (node) {
	const parent = node.keepParent?.element;
	return parent?.parentNode ? parent : undefined;
}

/** @type {import('../../types.d.ts').PluginProto<'keep-markup'>} */
const Self = {
	id: 'keep-markup',
	optional: 'normalize-whitespace',
	effect (Prism) {
		return Prism.hooks.add({
			'before-highlight': env => {
				if (!env.element.children.length) {
					return;
				}

				if (!isActive(env.element, 'keep-markup', true)) {
					return;
				}

				const dropTokens = isActive(env.element, 'drop-tokens', false);
				/**
				 * Returns whether the given element should be kept.
				 *
				 * @param {Element} element
				 * @returns {boolean}
				 */
				function shouldKeep (element) {
					if (
						dropTokens &&
						element.nodeName.toLowerCase() === 'span' &&
						element.classList.contains('token')
					) {
						return false;
					}
					return true;
				}

				let pos = 0;
				/** @type {NodeData[]} */
				const data = [];
				/** @type {NodeData | undefined} */
				let keepParent;

				/**
				 * @param {Element} element
				 */
				function processElement (element) {
					if (!shouldKeep(element)) {
						// don't keep this element and just process its children
						processChildren(element);
						return;
					}

					/** @type {NodeData} */
					const o = {
						// Store original element so we can restore it after highlighting
						element,
						posOpen: pos,
						posClose: NaN,
						keepParent,
					};
					data.push(o);

					const prevKeepParent = keepParent;
					keepParent = o;
					processChildren(element);
					keepParent = prevKeepParent;

					o.posClose = pos;
				}

				/**
				 * @param {Element} element
				 */
				function processChildren (element) {
					for (let i = 0, l = element.childNodes.length; i < l; i++) {
						const child = element.childNodes[i];
						if (isElement(child)) {
							processElement(child);
						}
						else if (isText(child)) {
							pos += child.data.length;
						}
					}
				}
				processChildren(env.element);

				if (data.length) {
					// data is an array of all existing tags
					env.markupData = data;
				}
			},
			'after-highlight': env => {
				/** @type {NodeData[]} */
				const data = env.markupData ?? [];
				if (data.length) {
					/**
					 * @param {Element} elt
					 * @param {NodeState} nodeState
					 */
					const walk = (elt, nodeState) => {
						for (let i = 0, l = elt.childNodes.length; i < l; i++) {
							const child = elt.childNodes[i];

							if (isElement(child)) {
								if (!walk(child, nodeState)) {
									return false;
								}
							}
							else if (isText(child)) {
								if (
									!nodeState.start &&
									nodeState.pos + child.data.length > nodeState.node.posOpen
								) {
									// We found the start position
									nodeState.start = [
										child,
										nodeState.node.posOpen - nodeState.pos,
									];
								}
								if (
									nodeState.start &&
									nodeState.pos + child.data.length >= nodeState.node.posClose
								) {
									// We found the end position
									nodeState.end = [
										child,
										nodeState.node.posClose - nodeState.pos,
									];
								}

								nodeState.pos += child.data.length;
							}

							if (nodeState.start && nodeState.end) {
								const parent = insertedKeepParent(nodeState.node);
								if (
									nodeState.node.posOpen === nodeState.node.posClose &&
									parent &&
									!parent.contains(nodeState.start[0])
								) {
									// Empty range at the same text offset as an
									// already-wrapped ancestor sits after that
									// ancestor. insertNode would flatten nested
									// zero-length markup (#1640).
									parent.appendChild(nodeState.node.element);
									return false;
								}

								// Select the range and wrap it with the element
								const range = document.createRange();
								range.setStart(...nodeState.start);
								range.setEnd(...nodeState.end);
								nodeState.node.element.innerHTML = '';
								nodeState.node.element.appendChild(range.extractContents());
								range.insertNode(nodeState.node.element);
								range.detach();

								// Process is over
								return false;
							}
						}
						return true;
					};

					// For each tag, we walk the DOM to reinsert it
					data.forEach(node => {
						const nodeState = { node, pos: 0 };
						walk(env.element, nodeState);

						// Empty markup at an ancestor's posClose has no later
						// text inside that ancestor, so the walk never starts.
						const parent = insertedKeepParent(node);
						if (!nodeState.start && node.posOpen === node.posClose && parent) {
							parent.appendChild(node.element);
						}
					});
					// Store new highlightedCode for later hooks calls
					env.highlightedCode = env.element.innerHTML;
				}
			},
		});
	},
};

export default Self;

prism.pluginRegistry.add(Self);

/**
 * @typedef {object} NodeData
 * @property {Element} element
 * @property {number} posOpen
 * @property {number} posClose
 * @property {NodeData} [keepParent]
 */

/**
 * @typedef {[node: Text, pos: number]} End
 */

/**
 * @typedef {object} NodeState
 * @property {NodeData} node
 * @property {number} pos
 * @property {End} [start]
 * @property {End} [end]
 */
