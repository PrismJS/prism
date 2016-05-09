(function() {

if (typeof self === 'undefined' || !self.Prism || !self.document) {
	return;
}

var assign = Object.assign || function (obj1, obj2) {
	for (var name in obj2) {
		if (obj2.hasOwnProperty(name))
			obj1[name] = obj2[name];
	}
	return obj1;
}

var specs = {},
    reloadSettings = false;

Prism.plugins.ParseSettings = {
	declare: function(pluginSpecs) {
		assign(specs, pluginSpecs);
		reloadSettings = true;
	}
};

function loadSettings(parent) {
	var settings = {};

	do {
		for (var i = 0, attrs = parent.attributes; i < attrs.length; ++i) {
			var name = attrs[i].nodeName,
			    val = attrs[i].nodeValue;

			if (name === 'class') {
				for (var j = 0, classes = val.split(/\s+/); j < classes.length; ++j) {
					name = classes[j];
					if (name.indexOf('no-') === 0) {
						name = name.substring(3);
						if (specs[name])
							settings[name] = false;
					} else {
						if (specs[name])
							settings[name] = true;
					}
				}
			} else if (name.indexOf('data-') === 0) {
				name = name.substring(5);
				if (specs[name])
					settings[name] = val;
			}
		}
	} while ((parent = parent.parentNode) && parent.hasAttribute);

	return settings;
}

function applySpecs(settings, specs) {
	var out = {};

	for (var name in specs) {
		var spec = specs[name] || {},
		    value = settings[name] || spec['default'];

		switch(spec.type) {
		case 'int':
			value = parseInt(value);
			break;
		case 'boolean':
		case 'bool':
			value = (value === 'false' || value === 'no') ? false : (value === '') ? true : !!value;
			break;
		case 'number':
		case 'float':
			value = parseFloat(value);
			break;
		}

		if (value || value === false || value === 0) {
			out[name] = value;
		}
	}

	return out;
}

function getSettings(pluginSpecs) {
	if (reloadSettings) {
		this.rawSettings = loadSettings(this.element);
	}

	return applySpecs(this.rawSettings || {}, pluginSpecs || specs);
}

Prism.hooks.add('before-highlight', function (env) {
	env.getSettings = getSettings;
});

}());