import { createT4 } from '../shared/languages/t4-templating';
import csharp from './prism-csharp';

export default /** @type {import("../types").LanguageProto<'t4-cs'>} */ ({
	id: 't4-cs',
	require: csharp,
	alias: 't4',
	grammar() {
		return createT4('csharp');
	}
});
