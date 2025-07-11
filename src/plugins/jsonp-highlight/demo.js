function dump_json (x) {
	return `using dump_json: ${JSON.stringify(x, null, 2)}`;
}

Prism.plugins.jsonphighlight.registerAdapter(
	x => `using registerAdapter: ${JSON.stringify(x, null, 2)}`
);
