Prism.hooks.add('before-insert', function(env){
	var el = env.element;
	if (!(el.hasAttribute('data-linenumber'))) return;
	var startNumber = parseInt(el.getAttribute('data-linenumber'))||0;
	el.style.counterReset = getComputedStyle(el).counterReset.replace(/-?\d+/, startNumber-1);
	var line = '<span class=line >', endline = '</span>';
	env.highlightedCode = line + env.highlightedCode.split('\n').join(endline+'\n'+line) + endline;
});
