import type { PluginProto } from '../../types';

type ClassMapper = (className: string) => string;
type ClassAdder = (env: ClassAdderEnvironment) => undefined | string | string[];
interface ClassAdderEnvironment {
	language: string;
	type: string;
	content: string;
}


export class CustomClass {
	private adder: ClassAdder | undefined;
	private mapper: ClassMapper | undefined;
	/**
	 * A prefix to add to all class names.
	 */
	prefix = '';

	/**
	 * Sets the function which can be used to add custom aliases to any token.
	 */
	add(classAdder: ClassAdder) {
		this.adder = classAdder;
	}

	/**
	 * Maps all class names using the given object or map function.
	 *
	 * This does not affect the prefix.
	 */
	map(classMapper: Record<string, string> | ClassMapper) {
		if (typeof classMapper === 'function') {
			this.mapper = classMapper;
		} else {
			this.mapper = (className) => classMapper[className] || className;
		}
	}

	/**
	 * Applies the current mapping and prefix to the given class name.
	 *
	 * @param className A single class name.
	 */
	apply(className: string) {
		return this.prefix + (this.mapper ? this.mapper(className) : className);
	}
}

export default {
	id: 'custom-class',
	plugin() {
		return new CustomClass();
	},
	effect(Prism) {
		const customClass = Prism.plugins.customClass;

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

			env.classes = env.classes.map((c) => customClass.apply(c));
		});
	}
} as PluginProto<'custom-class'>;
