import type { Grammar } from '../../types';
import type { Registry } from '../registry';

export function resolve (
	components: Registry,
	reference: Grammar | string | null | undefined
): Grammar | undefined {
	if (reference) {
		if (typeof reference === 'string') {
			return components.getLanguage(reference);
		}
		return reference;
	}
	return undefined;
}
