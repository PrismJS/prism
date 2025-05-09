/* global Prism */

// elements with a .no-highlight class will be ignored
Prism.plugins.filterHighlightAll.reject.addSelector('code.no-highlight');
Prism.plugins.filterHighlightAll.reject.addSelector('pre.no-highlight > code');

// don't highlight CSS code
Prism.plugins.filterHighlightAll.add(function (env) {
	return env.language !== 'css';
});
