const filterHighlightAll = Prism.pluginRegistry.peek('filter-highlight-all').plugin;

// elements with a .no-highlight class will be ignored
filterHighlightAll.reject.addSelector('code.no-highlight');
filterHighlightAll.reject.addSelector('pre.no-highlight > code');

// don't highlight CSS code
filterHighlightAll.add(env => {
	return env.language !== 'css';
});
