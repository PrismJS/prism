/**
 * Plugin to add line numbers
 * 
 * To add line numbers to a highlighted code block
 * just add the attr data-linenums="1" to the pre element that
 * wraps the code block.
 * You can also set the starting line number by adding the attr
 * data-linenums-start="[YOUR STARTING NUMBER]" to the pre element
 *
 * @important THE show-invisibles PLUGIN IS REQUIRED FOR THIS PLUGIN TO WORK PROPERLY
 * 
 * @example <pre data-linenums="1"><code>[YOUR CODE]</code></pre>
 * @example <pre data-linenums="1" data-linenums-start="13"><code>[YOUR CODE]</code></pre>
 * 
 * @author Justin Carlson <env.justin@gmail.com>
 * @created 12/16/2012
 * 
 */
(function(){

	if(!window.Prism) {
		return;
	}

	var enabled = false;
	var lineNum = null;
	var start = null;
	
	// Create line number div
	var div = document.createElement('div');
	div.className = "linenumWrap";
	
	
	Prism.hooks.add('before-highlight', function(env) {
		
		enabled = env.element.parentNode.getAttribute('data-linenums');
		
		// Check is line numbering is enabled
		if(enabled) {
			
			div.innerHTML = '';
			// Get the starting line number
			start = env.element.parentNode.getAttribute('data-linenums-start');
			// we start it a line 2 since line 1 will be added after-highlight
			lineNum = start ? start : 1;
			
		}
	});
	
	// If we find a line break, add a linenumber following it
	Prism.hooks.add('wrap', function(env) {
		if(enabled) {
			console.log(env.content);
			var count = env.content.match(/\r\n|\r|\n/g) ? env.content.match(/\r\n|\r|\n/g).length : 0;
			console.log(count);
			for(var i=0; i<count; i++) {
				div.innerHTML += '<div class="linenum">' + ++lineNum + '</div>';
			}
		}
	});
	
	// Make sure the first and last line is numbered
	Prism.hooks.add('after-highlight', function(env) {
		if(enabled) {
			start = start ? start : 1;
			div.innerHTML = '<div class="linenum">' + start + '</div>' + div.innerHTML ;
			env.element.parentNode.appendChild(div.cloneNode(true));
		}
	});

})();