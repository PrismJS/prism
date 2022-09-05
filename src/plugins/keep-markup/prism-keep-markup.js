import { isActive } from '../../shared/dom-util';
import { addHooks } from '../../shared/hooks-util';

/**
 * @param {ChildNode} child
 * @returns {child is Element}
 */
function isElement(child) {
	return child.nodeType === 1;
}
/**
 * @param {ChildNode} child
 * @returns {child is Text}
 */
function isText(child) {
	return child.nodeType === 3;
}

/**
 * @type {import('../../core/hook-state').StateKey<NodeData[]>}
 *
 * @typedef NodeData
 * @property {Element} element
 * @property {number} posOpen
 * @property {number} posClose
 */
const markupData = 'keep-markup data';

export default /** @type {import("../../types").PluginProto<'keep-markup'>} */ ({
	id: 'keep-markup',
	optional: 'normalize-whitespace',
	effect(Prism) {
		return addHooks(Prism.hooks, {
			'before-highlight': (env) => {
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
				function shouldKeep(element) {
					if (dropTokens && element.nodeName.toLowerCase() === 'span' && element.classList.contains('token')) {
						return false;
					}
					return true;
				}

				let pos = 0;
				/** @type {NodeData[]} */
				const data = [];
				/**
				 * @param {Element} element
				 */
				function processElement(element) {
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
						posClose: NaN
					};
					data.push(o);

					processChildren(element);

					o.posClose = pos;
				}
				/**
				 * @param {Element} element
				 */
				function processChildren(element) {
					for (let i = 0, l = element.childNodes.length; i < l; i++) {
						const child = element.childNodes[i];
						if (isElement(child)) {
							processElement(child);
						} else if (isText(child)) {
							pos += child.data.length;
						}
					}
				}
				processChildren(env.element);

				if (data.length) {
					// data is an array of all existing tags
					env.state.set(markupData, data);
				}
			},
			'after-highlight': (env) => {
				const data = env.state.get(markupData, []);
				if (data.length) {

					/**
					 * @param {Element} elt
					 * @param {{ node: NodeData, pos: number, start?: End, end?: End }} nodeState
					 * @typedef {[node: Text, pos: number]} End
					 */
					const walk = (elt, nodeState) => {
						for (let i = 0, l = elt.childNodes.length; i < l; i++) {

							const child = elt.childNodes[i];

							if (isElement(child)) {
								if (!walk(child, nodeState)) {
									return false;
								}
							} else if (isText(child)) {
								if (!nodeState.start && nodeState.pos + child.data.length > nodeState.node.posOpen) {
									// We found the start position
									nodeState.start = [child, nodeState.node.posOpen - nodeState.pos];
								}
								if (nodeState.start && nodeState.pos + child.data.length >= nodeState.node.posClose) {
									// We found the end position
									nodeState.end = [child, nodeState.node.posClose - nodeState.pos];
								}

								nodeState.pos += child.data.length;
							}

							if (nodeState.start && nodeState.end) {
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
					data.forEach((node) => {
						walk(env.element, { node, pos: 0 });
					});
					// Store new highlightedCode for later hooks calls
					env.highlightedCode = env.element.innerHTML;
				}
			}
		});
	}
});
