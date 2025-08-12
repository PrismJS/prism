export class LinkedList {
	/** @type {LinkedListHeadNode} */
	head;

	/** @type {LinkedListTailNode} */
	tail;

	/** @type {number} */
	length;

	constructor () {
		/** @type {LinkedListHeadNode} */
		const head = { value: null, prev: null, next: null };

		/** @type {LinkedListTailNode} */
		const tail = { value: null, prev: head, next: null };
		head.next = tail;

		this.head = head;
		this.tail = tail;
		this.length = 0;
	}

	/**
	 * Adds a new node with the given value to the list.
	 */
	addAfter (node, value) {
		// assumes that node != list.tail && values.length >= 0
		const next = node.next;

		/** @type {LinkedListMiddleNode} */
		const newNode = { value, prev: node, next };
		node.next = newNode;
		next.prev = newNode;
		this.length++;

		return newNode;
	}

	/**
	 * Removes `count` nodes after the given node. The given node will not be removed.
	 */
	removeRange (node, count) {
		let next = node.next;
		let i = 0;
		for (; i < count && next.next !== null; i++) {
			next = next.next;
		}
		node.next = next;
		next.prev = node;
		this.length -= i;
	}

	toArray () {
		const array = [];
		let node = this.head.next;
		while (node.next !== null) {
			array.push(node.value);
			node = node.next;
		}
		return array;
	}
}

/**
 * @typedef {import('./linked-list.d.ts').LinkedListMiddleNode} LinkedListMiddleNode
 * @typedef {import('./linked-list.d.ts').LinkedListHeadNode} LinkedListHeadNode
 * @typedef {import('./linked-list.d.ts').LinkedListTailNode} LinkedListTailNode
 */
