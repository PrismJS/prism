export interface LinkedListMiddleNode<T> {
	value: T;
	prev: LinkedListMiddleNode<T> | LinkedListHeadNode<T>;
	next: LinkedListMiddleNode<T> | LinkedListTailNode<T>;
}
export interface LinkedListHeadNode<T> {
	value: null;
	prev: null;
	next: LinkedListMiddleNode<T> | LinkedListTailNode<T>;
}
export interface LinkedListTailNode<T> {
	value: null;
	prev: LinkedListMiddleNode<T> | LinkedListHeadNode<T>;
	next: null;
}

export class LinkedList<T> {
	readonly head: LinkedListHeadNode<T>;
	readonly tail: LinkedListTailNode<T>;
	length: number;

	constructor() {
		const head: LinkedListHeadNode<T> = { value: null, prev: null, next: null as never };
		const tail: LinkedListTailNode<T> = { value: null, prev: head, next: null };
		head.next = tail;

		this.head = head;
		this.tail = tail;
		this.length = 0;
	}

	/**
	 * Adds a new node with the given value to the list.
	 *
	 * @param node
	 * @param value
	 * @returns The added node.
	 */
	addAfter(node: LinkedListHeadNode<T> | LinkedListMiddleNode<T>, value: T): LinkedListMiddleNode<T> {
		// assumes that node != list.tail && values.length >= 0
		const next = node.next;

		const newNode = { value, prev: node, next };
		node.next = newNode;
		next.prev = newNode;
		this.length++;

		return newNode;
	}

	/**
	 * Removes `count` nodes after the given node. The given node will not be removed.
	 */
	removeRange(node: LinkedListHeadNode<T> | LinkedListMiddleNode<T>, count: number): void {
		let next = node.next;
		let i = 0;
		for (; i < count && next.next !== null; i++) {
			next = next.next;
		}
		node.next = next;
		next.prev = node;
		this.length -= i;
	}

	toArray(): T[] {
		const array: T[] = [];
		let node = this.head.next;
		while (node.next !== null) {
			array.push(node.value);
			node = node.next;
		}
		return array;
	}
}
