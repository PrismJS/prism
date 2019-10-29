(function () {

	if (
		(typeof self === 'undefined' || !self.Prism) &&
		(typeof global === 'undefined' || !global.Prism)
	) {
		return;
	}

	/**
	 * @callback ClassMapper
	 * @param {string} className
	 * @param {string} language
	 * @returns {string}
	 *
	 * @callback ClassAdder
	 * @param {ClassAdderEnvironment} env
	 * @returns {undefined | string | string[]}
	 *
	 * @typedef ClassAdderEnvironment
	 * @property {string} language
	 * @property {string} type
	 * @property {string} content
	 */

	/** @type {ClassMapper} */
	var defaultClassMap = function (className) { return className; };

	// options

	/** @type {ClassAdder[]} */
	var classAdders = [];
	/** @type {ClassMapper} */
	var classMapper = defaultClassMap;
	/** @type {string} */
	var prefixString = '';


	Prism.plugins.customClass = {
		/**
		 * Sets the function which can be used to add custom aliases to any token.
		 *
		 * @param {ClassAdder} adder
		 */
		add: function (classAdder) {
			classAdders.push(classAdder);
		},
		/**
		 * Maps all class names using the given object or map function.
		 *
		 * This does not affect the prefix.
		 *
		 * @param {Object<string, string> | ClassMapper} classMap
		 */
		map: function map(classMap) {
			if (typeof classMap === 'function') {
				classMapper = classMap;
			} else {
				classMapper = function (className) {
					return classMap[className] || className;
				};
			}
		},
		/**
		 * Adds the given prefix to all class names.
		 *
		 * @param {string} string
		 */
		prefix: function prefix(string) {
			prefixString = string;
		}
	}

	Prism.hooks.add('wrap', function (env) {
		if (classAdders.length) {
			/** @type {ClassAdderEnvironment} */
			var adderEnv = {
				content: env.content,
				type: env.type,
				language: env.language
			};
			for (var i = 0, l = classAdders.length; i < l; i++) {
				var result = classAdders[i](adderEnv);
				if (result) {
					if (Array.isArray(result)) {
						env.classes.push.apply(env.classes, result);
					} else {
						env.classes.push(result);
					}
				}
			}
		}

		if (classMapper === defaultClassMap && !prefixString) {
			return;
		}

		env.classes = env.classes.map(function (c) {
			return prefixString + classMapper(c, env.language);
		});
	});

})();
