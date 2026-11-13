import registry from '../registry.js';
import { createT4 } from '../shared/languages/t4-templating.js';
import vbnet from './vbnet.js';

/** @type {import('../types.d.ts').LanguageProto<'t4-vb'>} */
const Self = {
	id: 't4-vb',
	require: vbnet,
	grammar () {
		return createT4('vbnet');
	},
};

export default Self;

registry.add(Self);
