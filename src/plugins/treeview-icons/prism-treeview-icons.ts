import prism from '../../global';
import treeview from '../../languages/treeview';
import type { PluginProto } from '../../types';

const Self = {
	id: 'treeview-icons',
	require: treeview,
} as PluginProto<'treeview-icons'>;

export default Self;

prism.components.add(Self);
