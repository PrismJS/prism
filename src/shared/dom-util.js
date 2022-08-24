const lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;

/**
 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
 *
 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
 *
 * @param {Element} element
 * @returns {string}
 */
export function getLanguage(element) {
	/** @type {Element | null} */
	let e = element;
	for (; e; e = e.parentElement) {
		let m = lang.exec(e.className);
		if (m) {
			return m[1].toLowerCase();
		}
	}
	return 'none';
}


/**
 * Sets the Prism `language-xxxx` class of the given element.
 *
 * @param {Element} element
 * @param {string} language
 * @returns {void}
 */
export function setLanguage(element, language) {
	// remove all `language-xxxx` classes
	// (this might leave behind a leading space)
	element.className = element.className.replace(RegExp(lang, 'gi'), '');

	// add the new `language-xxxx` class
	// (using `classList` will automatically clean up spaces for us)
	element.classList.add('language-' + language);
}


/**
 * Returns whether a given class is active for `element`.
 *
 * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
 * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
 * given class is just the given class with a `no-` prefix.
 *
 * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
 * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
 * ancestors have the given class or the negated version of it, then the default activation will be returned.
 *
 * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
 * version of it, the class is considered active.
 *
 * @param {Element | null} element
 * @param {string} className
 * @param {boolean} [defaultActivation=false]
 * @returns {boolean}
 */
export function isActive(element, className, defaultActivation = false) {
	return element?.closest(`${className}, no-${className}`)?.classList?.contains(className) ?? defaultActivation;
}
