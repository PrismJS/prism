/**
 * @typedef LinkedListNode
 * @property {T} value
 * @property {LinkedListNode<T> | null} prev The previous node.
 * @property {LinkedListNode<T> | null} next The next node.
 * @template T
 * @private
 */

/**
 * @template T
 */
export class LinkedList {
	constructor() {
		/** @type {LinkedListNode<T>} */
		let head = { value: null, prev: null, next: null };
		/** @type {LinkedListNode<T>} */
		let tail = { value: null, prev: head, next: null };
		head.next = tail;

		this.head = head;
		this.tail = tail;
		this.length = 0;
	}

	/**
	 * Adds a new node with the given value to the list.
	 *
	 * @param {LinkedListNode<T>} node
	 * @param {T} value
	 * @returns {LinkedListNode<T>} The added node.
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
	 * @param {LinkedListNode<T>} node
	 * @param {number} count
	 * @template T
	 */
	removeRange(node, count) {
		let next = node.next;
		let i = 0;
		for (; i < count && next !== this.tail; i++) {
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
		while (node !== this.tail) {
			array.push(node.value);
			node = node.next;
		}
		return array;
	}
}
