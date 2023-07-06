import { createT4 } from '../shared/languages/t4-templating.js';
import vbnet from './prism-vbnet.js';
import type { LanguageProto } from '../types';

export default {
	id: 't4-vb',
	require: vbnet,
	grammar() {
		return createT4('vbnet');
	}
} as LanguageProto<'t4-vb'>;
