import t4Templating from './prism-t4-templating.js';
import vbnet from './prism-vbnet.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 't4-vb',
	require: [t4Templating, vbnet],
	grammar({ getLanguage }) {
		Prism.languages['t4-vb'] = Prism.languages['t4-templating'].createT4('vbnet');
	}
});
