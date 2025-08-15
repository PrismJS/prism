import prism from '../../global.js';

export class CustomClass {
	/**
	 * @type {ClassAdder | undefined}
	 */
	adder;

	/**
	 * @type {ClassMapper | undefined}
	 */
	mapper;

	/**
	 * A prefix to add to all class names.
	 *
	 * @type {string}
	 * @default ''
	 */
	prefix = '';

	/**
	 * Sets the function which can be used to add custom aliases to any token.
	 *
	 * @param {ClassAdder} classAdder
	 */
	add (classAdder) {
		this.adder = classAdder;
	}

	/**
	 * Maps all class names using the given object or map function.
	 *
	 * This does not affect the prefix.
	 *
	 * @param {object | ClassMapper} classMapper
	 */
	map (classMapper) {
		if (typeof classMapper === 'function') {
			this.mapper = classMapper;
		}
		else {
			this.mapper = className => classMapper[className] || className;
		}
	}

	/**
	 * Applies the current mapping and prefix to the given class name.
	 *
	 * @param {string} className A single class name.
	 * @returns {string}
	 */
	apply (className) {
		return this.prefix + (this.mapper ? this.mapper(className) : className);
	}
}

/** @type {import('../../types.d.ts').PluginProto<'custom-class'>} */
const Self = {
	id: 'custom-class',
	plugin () {
		return new CustomClass();
	},
	effect (Prism) {
		/** @type {CustomClass} */
		const customClass = Prism.plugins.customClass;

		return Prism.hooks.add('wrap', env => {
			if (customClass['adder']) {
				const result = customClass['adder']({
					content: env.content,
					type: env.type,
					language: env.language,
				});

				if (Array.isArray(result)) {
					env.classes.push(...result);
				}
				else if (result) {
					env.classes.push(result);
				}
			}

			if (!customClass['mapper'] && !customClass.prefix) {
				return;
			}

			env.classes = env.classes.map(c => customClass.apply(c));
		});
	},
};

export default Self;

prism.components.add(Self);

/**
 * @callback ClassMapper
 * @param {string} className
 * @returns {string}
 */

/**
 * @callback ClassAdder
 * @param {ClassAdderEnvironment} env
 * @returns {undefined | string | string[]}
 */

/**
 * @typedef {object} ClassAdderEnvironment
 * @property {string} language
 * @property {string} type
 * @property {string} content
 */
