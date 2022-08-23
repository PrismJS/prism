let uniqueId = 0;

/** @type {WeakMap<object, number>} */
const uniqueIdMap = new WeakMap();

/**
 * Returns a unique number for the given object. Later calls will still return the same number.
 *
 * @param {object} obj
 * @returns {number}
 */
function getObjectId(obj) {
	let id = uniqueIdMap.get(obj);
	if (id === undefined) {
		id = ++uniqueId;
		uniqueIdMap.set(obj, id);
	}
	return id;
}

/**
 * Returns the name of the type of the given value.
 *
 * @param {unknown} obj
 * @returns {string}
 * @example
 * type(null)      === 'Null'
 * type(undefined) === 'Undefined'
 * type(123)       === 'Number'
 * type('foo')     === 'String'
 * type(true)      === 'Boolean'
 * type([1, 2])    === 'Array'
 * type({})        === 'Object'
 * type(String)    === 'Function'
 * type(/abc+/)    === 'RegExp'
 */
function getType(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * @param {Record<string | number, any>} obj
 * @param {(this: any, key: string, value: any, type: string) => void} callback
 * @param {string | null} [type]
 * @param {Record<number, boolean>} [visited]
 */
export function DFS(obj, callback, type, visited) {
	visited = visited || {};


	for (let i in obj) {
		if (obj.hasOwnProperty(i)) {
			callback.call(obj, i, obj[i], type || i);

			let property = obj[i];
			let propertyType = getType(property);

			if (propertyType === 'Object' && !visited[getObjectId(property)]) {
				visited[getObjectId(property)] = true;
				DFS(property, callback, null, visited);
			} else if (propertyType === 'Array' && !visited[getObjectId(property)]) {
				visited[getObjectId(property)] = true;
				DFS(property, callback, i, visited);
			}
		}
	}
}

/**
 * @param {string} text
 * @returns {string}
 */
export function htmlEncode(text) {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
}
