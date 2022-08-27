export default /** @type {import("../../types").PluginProto} */ ({
	id: 'highlight-keywords',
	effect(Prism) {
		return Prism.hooks.add('wrap', (env) => {
			if (env.type !== 'keyword') {
				return;
			}
			env.classes.push('keyword-' + env.content);
		});
	}
});
