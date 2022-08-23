import { createT4 } from '../shared/languages/t4-templating.js';
import csharp from './prism-csharp.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 't4-cs',
	require: csharp,
	alias: 't4',
	grammar() {
		return createT4('csharp');
	}
});
