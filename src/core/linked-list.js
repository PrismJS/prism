/**
 * @typedef LinkedListMiddleNode
 * @property {T} value
 * @property {LinkedListMiddleNode<T> | LinkedListHeadNode<T>} prev
 * @property {LinkedListMiddleNode<T> | LinkedListTailNode<T>} next
 * @template T
 */
/**
 * @typedef LinkedListHeadNode
 * @property {null} value
 * @property {null} prev
 * @property {LinkedListMiddleNode<T> | LinkedListTailNode<T>} next
 * @template T
 */
/**
 * @typedef LinkedListTailNode
 * @property {null} value
 * @property {LinkedListMiddleNode<T> | LinkedListHeadNode<T>} prev
 * @property {null} next
 * @template T
 */
/**
 * @typedef {LinkedListHeadNode<T> | LinkedListTailNode<T> | LinkedListMiddleNode<T>} LinkedListNode
 * @template T
 */

/**
 * @template T
 */
export class LinkedList {
	constructor() {
		/** @type {LinkedListHeadNode<T>} */
		let head = { value: null, prev: null, next: /** @type {any} */ (null) };
		/** @type {LinkedListTailNode<T>} */
		let tail = { value: null, prev: head, next: null };
		head.next = tail;

		this.head = head;
		this.tail = tail;
		this.length = 0;
	}

	/**
	 * Adds a new node with the given value to the list.
	 *
	 * @param {LinkedListHeadNode<T> | LinkedListMiddleNode<T>} node
	 * @param {T} value
	 * @returns {LinkedListMiddleNode<T>} The added node.
	 */
	addAfter(node, value) {
		// assumes that node != list.tail && values.length >= 0
		let next = node.next;

		let newNode = { value: value, prev: node, next: next };
		node.next = newNode;
		next.prev = newNode;
		this.length++;

		return newNode;
	}

	/**
	 * Removes `count` nodes after the given node. The given node will not be removed.
	 *
	 * @param {LinkedListHeadNode<T> | LinkedListMiddleNode<T>} node
	 * @param {number} count
	 */
	removeRange(node, count) {
		let next = node.next;
		let i = 0;
		for (; i < count && next.next !== null; i++) {
			next = next.next;
		}
		node.next = next;
		next.prev = node;
		this.length -= i;
	}

	/**
	 * @returns {T[]}
	 */
	toArray() {
		let array = [];
		let node = this.head.next;
		while (node.next !== null) {
			array.push(node.value);
			node = node.next;
		}
		return array;
	}
}
