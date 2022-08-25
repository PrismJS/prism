(function () {

	if (typeof Prism === 'undefined') {
		return;
	}

	Prism.hooks.add('wrap', (env) => {
		if (env.type !== 'keyword') {
			return;
		}
		env.classes.push('keyword-' + env.content);
	});

}());
