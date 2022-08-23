import { createT4 } from '../shared/languages/t4-templating.js';
import vbnet from './prism-vbnet.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 't4-vb',
	require: vbnet,
	grammar() {
		return createT4('vbnet');
	}
});
