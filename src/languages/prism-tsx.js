import jsx from './prism-jsx.js';
import typescript from './prism-typescript.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'tsx',
	require: [jsx, typescript],
	grammar({ extend, getLanguage }) {
		let typescript = Prism.util.clone(Prism.languages.typescript);
		Prism.languages.tsx = extend('jsx', typescript);

		// doesn't work with TS because TS is too complex
		delete Prism.languages.tsx['parameter'];
		delete Prism.languages.tsx['literal-property'];

		// This will prevent collisions between TSX tags and TS generic types.
		// Idea by https://github.com/karlhorky
		// Discussion: https://github.com/PrismJS/prism/issues/2594#issuecomment-710666928
		let tag = Prism.languages.tsx.tag;
		tag.pattern = RegExp(/(^|[^\w$]|(?=<\/))/.source + '(?:' + tag.pattern.source + ')', tag.pattern.flags);
		tag.lookbehind = true;
	}
});
