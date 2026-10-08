import registry from '../registry.js';
import { createT4 } from '../shared/languages/t4-templating.js';
import csharp from './csharp.js';

/** @type {import('../types.d.ts').LanguageProto<'t4-cs'>} */
const Self = {
	id: 't4-cs',
	require: csharp,
	alias: 't4',
	grammar () {
		return createT4('csharp');
	},
};

export default Self;

registry.add(Self);
