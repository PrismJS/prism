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


export class CustomClass {
	constructor() {
		/**
		 * @type {ClassAdder | undefined}
		 * @private
		 */
		this.adder = undefined;
		/**
		 * @type {ClassMapper | undefined}
		 * @private
		 */
		this.mapper = undefined;

		/**
		 * A prefix to add to all class names.
		 *
		 * @type {string}
		 * @default '''
		 */
		this.prefix = '';
	}

	/**
	 * Sets the function which can be used to add custom aliases to any token.
	 *
	 * @param {ClassAdder} classAdder
	 */
	add(classAdder) {
		this.adder = classAdder;
	}

	/**
	 * Maps all class names using the given object or map function.
	 *
	 * This does not affect the prefix.
	 *
	 * @param {Record<string, string> | ClassMapper} classMapper
	 */
	map(classMapper) {
		if (typeof classMapper === 'function') {
			this.mapper = classMapper;
		} else {
			this.mapper = function (className) {
				return classMapper[className] || className;
			};
		}
	}

	/**
	 * Applies the current mapping and prefix to the given class name.
	 *
	 * @param {string} className A single class name.
	 * @param {string} language The language of the code that contains this class name.
	 *
	 * If the language is unknown, pass `"none"`.
	 */
	apply(className, language) {
		return this.prefix + (this.mapper ? this.mapper(className, language) : className);
	}
}

export default /** @type {import("../../types").PluginProto} */ ({
	id: 'custom-class',
	plugin() {
		return new CustomClass();
	},
	effect(Prism) {
		const customClass = /** @type {CustomClass} */ (Prism.plugins.customClass);

		return Prism.hooks.add('wrap', (env) => {
			if (customClass['adder']) {
				const result = customClass['adder']({
					content: env.content,
					type: env.type,
					language: env.language
				});

				if (Array.isArray(result)) {
					env.classes.push(...result);
				} else if (result) {
					env.classes.push(result);
				}
			}

			if (!customClass['mapper'] && !customClass.prefix) {
				return;
			}

			env.classes = env.classes.map((c) => customClass.apply(c, env.language));
		});
	}
});
