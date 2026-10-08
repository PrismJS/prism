import registry from '../../registry.js';

/** @type {import('../../types.d.ts').PluginProto<'highlight-keywords'>} */
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
};

export default Self;

registry.add(Self);
