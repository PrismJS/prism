import prism from '../../global.js';

// Give Prism a chance to load the plugins
setTimeout(() => {
	// elements with a .no-highlight class will be ignored
	prism.plugins.filterHighlightAll.reject.addSelector('code.no-highlight');
	prism.plugins.filterHighlightAll.reject.addSelector('pre.no-highlight > code');

	// don't highlight CSS code
	prism.plugins.filterHighlightAll.add(env => {
		return env.language !== 'css';
	});
}, 100);
