import { createT4 } from '../shared/languages/t4-templating';
import vbnet from './prism-vbnet';

export default /** @type {import("../types").LanguageProto<'t4-vb'>} */ ({
	id: 't4-vb',
	require: vbnet,
	grammar() {
		return createT4('vbnet');
	}
});
