function dump_json (x) {
	return `using dump_json: ${JSON.stringify(x, null, 2)}`;
}

const jsonpHighlight = Prism.pluginRegistry.peek('jsonp-highlight').plugin;

jsonpHighlight.registerAdapter('dump', x => `using registerAdapter: ${JSON.stringify(x, null, 2)}`);
