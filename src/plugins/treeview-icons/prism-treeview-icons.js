import prism from '../../global.js';
import treeview from '../../languages/treeview.js';

/** @type {import('../../types.d.ts').PluginProto<'treeview-icons'>} */
const Self = {
	id: 'treeview-icons',
	require: treeview,
};

export default Self;

prism.components.add(Self);
