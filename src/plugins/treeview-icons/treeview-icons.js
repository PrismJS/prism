import treeview from '../../languages/treeview.js';
import registry from '../../registry.js';

/** @type {import('../../types.d.ts').PluginProto<'treeview-icons'>} */
const Self = {
	id: 'treeview-icons',
	require: treeview,
};

export default Self;

registry.add(Self);
