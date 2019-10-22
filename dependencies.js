"use strict";

/**
 * @typedef {Object<string, ComponentCategory>} Components
 * @typedef {Object<string, ComponentEntry | string>} ComponentCategory
 *
 * @typedef ComponentEntry
 * @property {string} [title] The title of the component.
 * @property {string} [owner] The GitHub user name of the owner.
 * @property {boolean} [noCSS=false] Whether the component doesn't have style sheets which should also be loaded.
 * @property {string | string[]} [alias] An optional list of aliases for the id of the component.
 * @property {Object<string, string>} [aliasTitles] An optional map from an alias to its title.
 *
 * Aliases which are not in this map will the get title of the component.
 * @property {string | string[]} [require]
 * @property {string | string[]} [modify]
 * @property {string | string[]} [after]
 */

var getLoad = (function () {

	/**
	 * A function which does absolutely nothing.
	 *
	 * @type {any}
	 */
	var noop = function () { };

	/**
	 * Converts the given value to an array.
	 *
	 * If the given value is already an array, the value itself will be returned.
	 * `null` and `undefined` will return an empty array.
	 * For every other value a new array with the given value as its only element will be created.
	 *
	 * @param {null | undefined | T | T[]} value
	 * @returns {T[]}
	 * @template T
	 */
	function toArray(value) {
		if (Array.isArray(value)) {
			return value;
		} else {
			return value == null ? [] : [value];
		}
	}

	/**
	 * Returns a new set for the given string array.
	 *
	 * @param {string[]} array
	 * @returns {StringSet}
	 *
	 * @typedef {Object<string, true>} StringSet
	 */
	function toSet(array) {
		/** @type {StringSet} */
		var set = {};
		for (var i = 0, l = array.length; i < l; i++) {
			set[array[i]] = true;
		}
		return set;
	}

	/**
	 * Creates a map of every components id to its entry.
	 *
	 * @param {Components} components
	 * @returns {EntryMap}
	 *
	 * @typedef {{ [id: string]: Readonly<ComponentEntry> | undefined }} EntryMap
	 */
	function createEntryMap(components) {
		/** @type {EntryMap} */
		var map = {};

		for (var categoryName in components) {
			var category = components[categoryName];
			for (var id in category) {
				if (id != 'meta') {
					/** @type {ComponentEntry | string} */
					var entry = category[id];
					map[id] = typeof entry == 'string' ? { title: entry } : entry;
				}
			}
		}

		return map;
	}

	/**
	 * Creates a full dependencies map which includes all types of dependencies and their transitive dependencies.
	 *
	 * @param {EntryMap} entryMap
	 * @returns {DependencyMap}
	 *
	 * @typedef {Object<string, StringSet>} DependencyMap
	 */
	function createDependencyMap(entryMap) {
		/** @type {DependencyMap} */
		var map = {};

		/**
		 * Adds the dependencies of the given component to the dependency map.
		 *
		 * @param {string} id
		 * @param {string[]} stack
		 */
		function addToMap(id, stack) {
			if (id in map) {
				return;
			}

			stack.push(id);

			// check for circular dependencies
			var firstIndex = stack.indexOf(id);
			if (firstIndex < stack.length - 1) {
				throw new Error('Circular dependency: ' + stack.slice(firstIndex).join(' -> '));
			}

			/** @type {StringSet} */
			var dependencies = {};

			var entry = entryMap[id];
			if (entry) {
				/** @type {string[]} */
				var deps = [].concat(entry.require, entry.modify, entry.after).filter(Boolean);
				deps.forEach(function (depId) {
					if (!(depId in entryMap)) {
						throw new Error(id + ' depends on an unknown component ' + depId);
					}

					addToMap(depId, stack);
					dependencies[depId] = true;
					for (var transitiveDepId in map[depId]) {
						dependencies[transitiveDepId] = true;
					}
				});
			}

			map[id] = dependencies;

			stack.pop();
		}

		for (var id in entryMap) {
			addToMap(id, []);
		}

		return map;
	}

	/**
	 * Returns a function which resolves the aliases of its given id of alias.
	 *
	 * @param {EntryMap} entryMap
	 * @returns {(idOrAlias: string) => string}
	 */
	function createAliasResolver(entryMap) {
		/** @type {Object<string, string>} */
		var map = {};

		for (var id in entryMap) {
			var entry = entryMap[id];
			var aliases = toArray(entry && entry.alias);
			aliases.forEach(function (alias) {
				if (alias in map) {
					throw new Error(alias + ' cannot be alias for both ' + id + ' and ' + map[alias]);
				}
				if (alias in entryMap) {
					throw new Error(alias + ' cannot be alias of ' + id + ' because it is a component.');
				}
				map[alias] = id;
			});
		}

		return function (idOrAlias) {
			return map[idOrAlias] || idOrAlias;
		};
	}

	/**
	 * Creates an implicit DAG from the given components and dependencies and call the given `loadComponent` for each
	 * component in topological order.
	 *
	 * @param {DependencyMap} dependencyMap
	 * @param {StringSet} ids
	 * @param {(id: string) => T} loadComponent
	 * @param {(before: T, after: T) => T} series
	 * @param {(values: T[]) => T} parallel
	 * @returns {T}
	 * @template T
	 */
	function loadComponentsInOrder(dependencyMap, ids, loadComponent, series, parallel) {
		/** @type {Object<string, T>} */
		var cache = {};

		/**
		 * A set of ids of nodes which are not depended upon by any other node in the graph.
		 * @type {StringSet}
		 */
		var ends = {};

		/**
		 * Loads the given component and its dependencies or returns the cached value.
		 *
		 * @param {string} id
		 * @returns {T}
		 */
		function handleId(id) {
			if (id in cache) {
				return cache[id];
			}

			// assume that it's an end
			// if it isn't, it will be removed later
			ends[id] = true;

			// all dependencies of the component in the given ids
			var dependsOn = [];
			for (var depId in dependencyMap[id]) {
				if (depId in ids) {
					dependsOn.push(depId);
				}
			}

			/**
			 * The value to be returned.
			 * @type {T}
			 */
			var value;

			if (dependsOn.length === 0) {
				value = loadComponent(id);
			} else {
				var depsValue = parallel(dependsOn.map(function (depId) {
					var value = handleId(depId);
					// none of the dependencies can be ends
					delete ends[depId];
					return value;
				}));
				value = series(depsValue, loadComponent(id));
			}

			// cache and return
			return cache[id] = value;
		}

		for (var id in ids) {
			handleId(id);
		}

		/** @type {T[]} */
		var endValues = [];
		for (var endId in ends) {
			endValues.push(cache[endId]);
		}
		return parallel(endValues);
	}

	/**
	 * Returns whether the given object has any keys.
	 *
	 * @param {object} obj
	 */
	function hasKeys(obj) {
		for (var key in obj) {
			return true;
		}
		return false;
	}

	/**
	 * Returns an object which provides methods to get the ids of the components which have to be loaded (`getIds`) and
	 * a way to efficiently load them in synchronously and asynchronous contexts (`load`).
	 *
	 * The set of ids to be loaded is a superset of `load`. If some of these ids are in `loaded`, the corresponding
	 * components will have to reloaded.
	 *
	 * The ids in `load` and `loaded` may be in any order and can contain duplicates.
	 *
	 * @param {Components} components
	 * @param {string[]} load
	 * @param {string[]} [loaded=[]] A list of already loaded components.
	 *
	 * If a component is in this list, then all of its requirements will also be assumed to be in the list.
	 * @returns {GetLoadResult}
	 *
	 * @typedef GetLoadResult
	 * @property {() => string[]} getIds A function to get all ids of the components to load.
	 *
	 * The returned ids will be duplicate-free, alias-free and in load order.
	 * @property {LoadFunction} load A functional interface to load components.
	 *
	 * @typedef {<T> (loadComponent: (id: string) => T, series?: (before: T, after: T) => T, parallel?: (values: T[]) => T) => T} LoadFunction
	 * A functional interface to load components.
	 *
	 * The `loadComponent` function will be called for every component in the order in which they have to be loaded.
	 *
	 * `series` and `parallel` are useful for asynchronous loading and can be thought of as
	 * `Promise#then` and `Promise.all`.
	 *
	 * _Note:_ Even though, both `series` and `parallel` are optional, they have to both defined or both
	 * undefined together. It's not valid for just one to be defined while the other is undefined.
	 *
	 * @example
	 * load(id => { loadComponent(id); }); // returns undefined
	 *
	 * await load(
	 *     id => loadComponentAsync(id), // returns a Promise for each id
	 *     (before, after) => before.then(() => after),
	 *     Promise.all
	 * );
	 */
	function getLoad(components, load, loaded) {
		var entryMap = createEntryMap(components);
		var resolveAlias = createAliasResolver(entryMap);

		load = load.map(resolveAlias);
		loaded = (loaded || []).map(resolveAlias);

		var loadSet = toSet(load);
		var loadedSet = toSet(loaded);

		// add requirements

		load.forEach(addRequirements);
		function addRequirements(id) {
			var entry = entryMap[id];
			if (entry) {
				var require = toArray(entry.require);
				require.forEach(function (reqId) {
					if (!(reqId in loadedSet)) {
						loadSet[reqId] = true;
						addRequirements(reqId);
					}
				});
			}
		}

		// add components to reload

		// A component x in `loaded` has to be reloaded if
		//  1) a component in `load` modifies x.
		//  2) x depends on a component in `load`.
		// The above two condition have to be applied until nothing changes anymore.

		var dependencyMap = createDependencyMap(entryMap);

		/** @type {StringSet} */
		var loadAdditions = loadSet;
		/** @type {StringSet} */
		var newIds;
		while (hasKeys(loadAdditions)) {
			newIds = {};

			// condition 1)
			for (var loadId in loadAdditions) {
				var entry = entryMap[loadId];
				if (entry) {
					var modify = toArray(entry.modify);
					modify.forEach(function (modId) {
						if (modId in loadedSet) {
							newIds[modId] = true;
						}
					});
				}
			}

			// condition 2)
			for (var loadedId in loadedSet) {
				if (!(loadedId in loadSet)) {
					for (var depId in dependencyMap[loadedId]) {
						if (depId in loadSet) {
							newIds[loadedId] = true;
							break;
						}
					}
				}
			}

			loadAdditions = newIds;
			for (var newId in loadAdditions) {
				loadSet[newId] = true;
			}
		}

		/** @type {GetLoadResult} */
		var result = {
			getIds: function () {
				var ids = [];
				result.load(function (id) {
					ids.push(id);
				});
				return ids;
			},
			load: function (loadComponent, series, parallel) {
				return loadComponentsInOrder(dependencyMap, loadSet, loadComponent, series || noop, parallel || noop);
			}
		};

		return result;
	}

	return getLoad;

}());

if (typeof module !== 'undefined') {
	module.exports = getLoad;
}
