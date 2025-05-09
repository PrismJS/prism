/* global Prism */

// eslint-disable-next-line no-unused-vars
function dump_json(x) {
	return 'using dump_json: ' + JSON.stringify(x, null, 2);
}

Prism.plugins.jsonphighlight.registerAdapter(
	function (x) {
		return 'using registerAdapter: ' + JSON.stringify(x, null, 2);
	}
);
