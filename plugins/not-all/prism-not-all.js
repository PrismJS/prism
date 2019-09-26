(function () {

	if (typeof self !== 'undefined' && !self.Prism) {
		return;
	}

	/**
	 * @type {Array<(element: HTMLElement) => boolean>}
	 */
	var filters = [];

	var config = Prism.plugins.notAll = {

		/**
		 * Filters the elements of `highlightAll` and `highlightAllUnder` such that only element for which the given
		 * function returns `true` will be highlighted.
		 *
		 * @param {(value: { element: HTMLElement, language: string }) => boolean} condition
		 */
		filter: function (condition) {
			filters.push(function (element) {
				return condition({
					element: element,
					language: Prism.util.getLanguage(element)
				});
			});
		},

		/**
		 * Filters the elements of `highlightAll` and `highlightAllUnder` such that only element which match the given
		 * CSS selection will be highlighted.
		 *
		 * @param {string} selector
		 */
		filterCss: function (selector) {
			filters.push(function (element) {
				return element.matches(selector);
			});
		},

		/**
		 * Filters the elements of `highlightAll` and `highlightAllUnder` such that only element with a known language
		 * will be highlighted. All elements with an unset or unknown language will be ignored.
		 *
		 * __Note:__ This will effectively disable the AutoLoader plugin.
		 */
		filterKnown: false,

	};

	config.filter(function filterKnown(env) {
		return !config.filterKnown || typeof Prism.languages[env.language] === 'object';
	});


	Prism.hooks.add('before-highlightall', function (env) {
		for (var i = 0, l = filters.length; i < l; i++) {
			env.filter(filters[i]);
		}
	});

}());
