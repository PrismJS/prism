"use strict";

var getLoad = (function () {

	/**
	 * @typedef {Object<string, ComponentCategory>} Components
	 * @typedef {{ meta: Object<string, any> } & Object<string, ComponentEntry>} ComponentCategory
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


	/**
	 * A function which does absolutely nothing.
	 *
	 * @type {any}
	 */
	var noop = function () { };

	/**
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
	 *
	 * @param {Components} components
	 * @param {string} id
	 * @returns {ComponentEntry}
	 */
	function getEntry(components, id) {
		for (var categoryName in components) {
			var category = components[categoryName];
			for (var entryId in category) {
				if (entryId === id) {
					return category[entryId];
				}
			}
		}
	}

	/**
	 * Creates a full dependencies map which includes all types of dependencies and their transitive dependencies.
	 *
	 * @param {Components} components
	 * @returns {DependencyMap}
	 * @typedef {Object<string, StringSet>} DependencyMap
	 */
	function createDependencyMap(components) {
		/** @type {DependencyMap} */
		var map = {};

		/**
		 *
		 * @param {string} id
		 * @param {ComponentEntry} [entry]
		 */
		function addToMap(id, entry) {
			if (id in map) {
				return;
			}

			if (entry == undefined) {
				entry = getEntry(components, id);
			}

			/** @type {StringSet} */
			var dependencies = {};

			[].concat(entry.require, entry.modify, entry.after).filter(Boolean).forEach(function (depId) {
				addToMap(depId);
				dependencies[depId] = true;
				for (var transitiveDepId in map[depId]) {
					dependencies[transitiveDepId] = true;
				}
			});

			map[id] = dependencies;
		}

		for (var categoryName in components) {
			var category = components[categoryName];
			for (var id in category) {
				if (id === 'meta') {
					continue;
				} else {
					addToMap(id, category[id]);
				}
			}
		}

		return map;
	}

	/**
	 *
	 * @param {DependencyMap} dependencyMap
	 * @param {StringSet} ids
	 * @param {(id: string) => T} loadComponent
	 * @param {(before: T, after: T) => T} series
	 * @param {(values: T[]) => T} parallel
	 * @returns {T}
	 * @template T
	 */
	function loadDAG(dependencyMap, ids, loadComponent, series, parallel) {
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
	 * Returns a new array with the ids of the components which have to be loaded. The returns ids can be in any order
	 * and will be duplicate-free.
	 *
	 * The returned ids will be superset of `load`. If some of the returned ids are in `loaded`, the corresponding
	 * components will have to reloaded.
	 *
	 * The ids in `load` and `loaded` may be in any order and can contain duplicates.
	 *
	 * @param {Components} components
	 * @param {string[]} load
	 * @param {string[]} [loaded=[]] A list of already loaded components.
	 *
	 * If a component is in this list, then all of its requirements will also be assumed to be in the list.
	 */
	function getLoad(components, load, loaded) {
		var loadedSet = toSet(loaded || []);
		var loadSet = toSet(load);

		// add requirements

		load.forEach(addRequirements);
		function addRequirements(id) {
			var require = toArray(getEntry(components, id).require);
			require.forEach(function (reqId) {
				if (!(reqId in loadedSet)) {
					loadSet[reqId] = true;
					addRequirements(reqId);
				}
			});
		}

		// add components to reload

		// A component x in `loaded` has to be reloaded if
		//  1) a component in `load` modifies x.
		//  2) x depends on a component in `load`.
		// The above two condition have to be applied until nothing changes anymore.

		var dependencyMap = createDependencyMap(components);

		/** @type {StringSet} */
		var loadAdditions = loadSet;
		/** @type {StringSet} */
		var newIds;
		while (hasKeys(loadAdditions)) {
			newIds = {};

			// condition 1)
			for (var loadId in loadAdditions) {
				var modify = toArray(getEntry(components, loadId).modify);
				modify.forEach(function (modId) {
					if (modId in loadedSet) {
						newIds[modId] = true;
					}
				});
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

		// return ids and a method to load them

		return {
			ids: Object.keys(loadSet),
			/**
			 * A functional interface to load components.
			 *
			 * The `loadComponent` will be called for every component in the order in which they are loaded.
			 *
			 * `series` and `parallel` are useful for asynchronous loading and can be thought of as
			 * `Promise#then` and `Promise.all`.
			 *
			 * _Note:_ Even though, both `series` and `parallel` are optional, they have to both defined or both
			 * undefined together. It's not valid for just one to be defined while the other is undefined.
			 *
			 * @param {(id: string) => T} loadComponent
			 * @param {(before: T, after: T) => T} [series]
			 * @param {(values: T[]) => T} [parallel]
			 * @return {T}
			 * @template T
			 */
			load: function (loadComponent, series, parallel) {
				return loadDAG(dependencyMap, loadSet, loadComponent, series || noop, parallel || noop);
			}
		};
	}

	return getLoad;

}());

if (typeof module !== 'undefined') {
	module.exports = getLoad;
}
