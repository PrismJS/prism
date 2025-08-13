import prism from '../../global.js';

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

prism.components.add(Self);
