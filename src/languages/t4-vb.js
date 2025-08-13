import { createT4 } from '../shared/languages/t4-templating.js';
import vbnet from './vbnet.js';

/** @type {import('../types.d.ts').LanguageProto<'t4-vb'>} */
export default {
	id: 't4-vb',
	require: vbnet,
	grammar () {
		return createT4('vbnet');
	},
};
