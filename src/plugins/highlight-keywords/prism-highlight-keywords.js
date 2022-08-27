import { noop } from '../../shared/util.js';

export default /** @type {import("../../types").PluginProto} */ ({
	id: 'highlight-keywords',
	plugin(Prism) {
		return {}; // TODO:
	},
	effect(Prism) {
		Prism.hooks.add('wrap', (env) => {
			if (env.type !== 'keyword') {
				return;
			}
			env.classes.push('keyword-' + env.content);
		});
	}
});
