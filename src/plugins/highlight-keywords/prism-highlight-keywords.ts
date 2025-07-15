import prism from '../../global';
import type { PluginProto } from '../../types';

const Self = {
	id: 'highlight-keywords',
	effect (Prism) {
		return Prism.hooks.add('wrap', env => {
			if (env.type !== 'keyword') {
				return;
			}
			env.classes.push('keyword-' + env.content);
		});
	},
} as PluginProto<'highlight-keywords'>;

export default Self;

prism.components.add(Self);
