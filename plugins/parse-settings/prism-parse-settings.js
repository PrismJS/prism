(function() {

if (typeof self === 'undefined' || !self.Prism || !self.document) {
	return;
}

var lang = /\blang(?:uage)?-(\w+)\b/i;

function hasData(node, i) {
	return i === 0 || (i == 1 && node.nodeName.toLowerCase() === 'pre') ||
			node.hasAttribute('data-prism') || lang.test(node.className);
}

function extractAttrs(prev, node) {
	return prev.concat(Array.prototype.slice.call(node.attributes));
}

function addClasses(settings, name) {
	if (name.indexOf('no-') === 0) {
		settings[name.substring(3)] = false;
	} else {
		settings[name] = true;
	}

	return settings;
}

function addAttrs(settings, attr) {
	var name = attr.nodeName.toLowerCase(),
	    value = attr.nodeValue;

	if (name === "class") {
		value.toLowerCase().split(/\s+/).reduce(addClasses, settings)
	} else if (name.indexOf('data-') === 0) {
		if (!value || value.toLowerCase() === 'true') {
			value = true;
		} else if (value.toLowerCase() === 'false') {
			value = false;
		}

		settings[name.substring(5)] = value;
	}
	return settings;
}

Prism.hooks.add('before-highlight', function (env) {
	if (env.settings)
		return;

	var parents = [],
	    parent = env.element;

	do {
		parents.push(parent);
	} while ((parent = parent.parentNode) && parent.hasAttribute);

	env.settings = parents.filter(hasData).reverse().
						reduce(extractAttrs, []).reduce(addAttrs, {});
});

}());