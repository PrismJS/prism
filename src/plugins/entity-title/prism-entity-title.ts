export default {
	id: 'entity-title',
	effect (Prism) {
		// Plugin to make entity title show the real entity, idea by Roman Komarov
		return Prism.hooks.add('wrap', env => {
			if (env.type === 'entity') {
				env.attributes['title'] = env.content.replace(/&amp;/, '&');
			}
		});
	}
}
