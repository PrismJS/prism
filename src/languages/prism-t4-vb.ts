import { createT4 } from '../shared/languages/t4-templating';
import vbnet from './prism-vbnet';
import type { LanguageProto } from '../types';

export default {
	id: 't4-vb',
	require: vbnet,
	grammar() {
		return createT4('vbnet');
	}
} as LanguageProto<'t4-vb'>;
