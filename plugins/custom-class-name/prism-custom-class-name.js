(function(){

if (
	typeof self !== 'undefined' && !self.Prism ||
	typeof global !== 'undefined' && !global.Prism
) {
	return;
}

var classMap;
Prism.plugins.customClassName = {
	use: function use(map) {
		classMap = map;
	}
}

Prism.hooks.add('wrap', function (env) {
	if (!classMap) {
		return;
	}

	var customClassName = classMap[env.type];
	// if style found, then replace
	if (typeof customClassName === 'string') {
		env.classes = [customClassName];
	}
});

})();
