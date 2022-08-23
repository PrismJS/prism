import t4Templating from './prism-t4-templating.js';
import csharp from './prism-csharp.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 't4-cs',
	require: [t4Templating, csharp],
	alias: 't4',
	grammar({ getLanguage }) {
		Prism.languages.t4 = Prism.languages['t4-cs'] = Prism.languages['t4-templating'].createT4('csharp');
	}
});
