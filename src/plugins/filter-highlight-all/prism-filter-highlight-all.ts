import { getLanguage } from '../../shared/dom-util';
import type { PluginProto } from '../../types';

type Condition = (value: { element: Element; language: string }) => boolean;

export class FilterHighlightAll {
	private filters: ((element: Element) => boolean)[] = [];
	/**
	 * Filters the elements of `highlightAll` and `highlightAllUnder` such that only elements with a known language
	 * will be highlighted. All elements with an unset or unknown language will be ignored.
	 *
	 * __Note:__ This will effectively disable the AutoLoader plugin.
	 *
	 * @default false
	 */
	filterKnown = false;

	/**
	 * Adds a new filter for the elements of `highlightAll` and `highlightAllUnder` such that only elements for
	 * which the given function returns `true` will be highlighted.
	 */
	add(condition: Condition) {
		this.filters.push((element) => {
			return condition({
				element,
				language: getLanguage(element)
			});
		});
	}

	/**
	 * Adds a new filter for the elements of `highlightAll` and `highlightAllUnder` such that only elements that
	 * match the given CSS selection will be highlighted.
	 */
	addSelector(selector: string) {
		this.filters.push((element) => {
			return element.matches(selector);
		});
	}

	reject = {
		/**
		 * Adds a new filter for the elements of `highlightAll` and `highlightAllUnder` such that only elements for
		 * which the given function returns `false` will be highlighted.
		 */
		add: (condition: Condition) => {
			this.add((value) => !condition(value));
		},

		/**
		 * Adds a new filter for the elements of `highlightAll` and `highlightAllUnder` such that only elements that do
		 * not match the given CSS selection will be highlighted.
		 */
		addSelector: (selector: string) => {
			this.filters.push((element) => {
				return !element.matches(selector);
			});
		},
	};

	/**
	 * Applies all filters to the given element and returns `true` if and only if every filter returned `true` on the
	 * given element.
	 */
	everyFilter(element: Element): boolean {
		for (const filter of this.filters) {
			if (!filter(element)) {
				return false;
			}
		}
		return true;
	}
}

export default {
	id: 'filter-highlight-all',
	plugin(Prism) {
		const config = new FilterHighlightAll();

		config.add((env) => {
			return !config.filterKnown || Prism.components.has(env.language);
		});

		if (typeof document !== 'undefined') {
			const script = document.currentScript;
			if (script) {
				config.filterKnown = script.hasAttribute('data-filter-known');

				let attr;
				attr = script.getAttribute('data-filter-selector');
				if (attr) {
					config.addSelector(attr);
				}
				attr = script.getAttribute('data-reject-selector');
				if (attr) {
					config.reject.addSelector(attr);
				}
			}
		}

		return config;
	},
	effect(Prism) {
		const config = Prism.plugins.filterHighlightAll;

		return Prism.hooks.add('before-all-elements-highlight', (env) => {
			env.elements = env.elements.filter((e) => config.everyFilter(e));
		});
	}
} as PluginProto<'filter-highlight-all'>;
