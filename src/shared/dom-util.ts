const lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;

/**
 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
 *
 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
 */
export function getLanguage (element: Element): string {
	let e: Element | null = element;
	for (; e; e = e.parentElement) {
		const m = lang.exec(e.className);
		if (m) {
			return m[1].toLowerCase();
		}
	}
	return 'none';
}

/**
 * Sets the Prism `language-xxxx` class of the given element.
 */
export function setLanguage (element: Element, language: string): void {
	// remove all `language-xxxx` classes
	// (this might leave behind a leading space)
	// eslint-disable-next-line regexp/no-unused-capturing-group
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
 * @param element
 * @param className
 * @param defaultActivation Defaults to `false`.
 * @returns
 */
export function isActive (
	element: Element | null,
	className: string,
	defaultActivation = false
): boolean {
	return (
		element?.closest(`.${className}, .no-${className}`)?.classList?.contains(className) ??
		defaultActivation
	);
}

/**
 * If the parent element of the given element is a `<pre>` element, then if
 * will be returned. Otherwise, `undefined` will be returned.
 */
export function getParentPre (element: Element): HTMLPreElement | undefined {
	const pre = element.parentElement;
	if (pre && /pre/i.test(pre.nodeName)) {
		return pre as HTMLPreElement;
	}
}
