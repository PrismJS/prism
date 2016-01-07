(function() {

if (typeof self === 'undefined' || !self.Prism || !self.document) {
	return;
}

var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

function hasData(node, i) {
	return i === 0 || (i == 1 && node.nodeName.toLowerCase() === 'pre') ||
			node.hasAttribute('data-prism') || lang.test(node.className);
}
function isDataAttr(attr) {
	return attr.nodeName && attr.nodeName !== 'data-prism' &&
			(attr.nodeName.indexOf('data-') === 0 || attr.nodeName === 'class');
}

function notEmpty(value) {
	return !!value;
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
	if (attr.nodeName === "class") {
		attr.nodeValue.toLowerCase().split(/\s+/).filter(notEmpty).reduce(addClasses, settings)
	} else {
		var value = attr.nodeValue;

		if (value === '' || value.toLowerCase() === 'true') {
			value = true;
		} else if (value.toLowerCase() === 'false') {
			value = false;
		}

		settings[attr.nodeName.substring(5).toLowerCase()] = value;
	}
	return settings;
}

Prism.hooks.add('before-highlight', function (env) {
	if (env.settings)
		return;

	var parents = [],
	    parent = env.element;

	while (parent && parent.hasAttribute) {
		parents.push(parent);
		parent = parent.parentNode;
	}

	env.settings = parents.filter(hasData).reverse().reduce(extractAttrs, [])
					.filter(isDataAttr).reduce(addAttrs, {});
});

}());