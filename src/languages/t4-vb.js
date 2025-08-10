import { createT4 } from '../shared/languages/t4-templating.js';
import vbnet from './vbnet.js';

export default {
	id: 't4-vb',
	require: vbnet,
	grammar () {
		return createT4('vbnet');
	},
};
