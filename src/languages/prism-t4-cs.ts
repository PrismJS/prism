import { createT4 } from '../shared/languages/t4-templating';
import csharp from './prism-csharp';
import type { LanguageProto } from '../types';

export default {
	id: 't4-cs',
	require: csharp,
	alias: 't4',
	grammar() {
		return createT4('csharp');
	}
} as LanguageProto<'t4-cs'>;
