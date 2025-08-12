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
	head: LinkedListHeadNode<T>;
	tail: LinkedListTailNode<T>;
	length: number;

	constructor ();

	/**
	 * Adds a new node with the given value to the list.
	 */
	addAfter (
		node: LinkedListHeadNode<T> | LinkedListMiddleNode<T>,
		value: T
	): LinkedListMiddleNode<T>;

	/**
	 * Removes `count` nodes after the given node. The given node will not be removed.
	 */
	removeRange (node: LinkedListHeadNode<T> | LinkedListMiddleNode<T>, count: number): void;

	/**
	 * Converts the list to an array.
	 */
	toArray (): T[];
}
