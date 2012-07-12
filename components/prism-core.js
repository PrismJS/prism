/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

(function(){

var _ = self.Prism = {
	languages: {},
		
	highlightAll: function(useWorkers, callback) {
		var elements = document.querySelectorAll('pre.prism, pre.prism > code, code.prism');

		for (var i=0, element; element = elements[i++];) {
			if(/pre/i.test(element.nodeName) && element.children.length > 0) {
				continue;
			}
			
			_.highlight(element, useWorkers === true, callback);
		}
	},
		
	highlight: function(element, useWorkers, callback) {
		if(!element) {
			return;
		}
		
		var language = (element.className.match(/language-(\w+)/i) || [])[1],
		    tokens = _.languages[language];

		if (!tokens) {
			return;
		}
		
		var code = element.textContent || element.innerText;
		
		if(!code) {
			return;
		}
		
		
		code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;')
		           .replace(/>/g, '&gt;').replace(/\u00a0/g, ' ');
		//console.time(code.slice(0,50));
		if (useWorkers && self.Worker) {
			if(self.worker) {
				self.worker.terminate();
			}	

			var worker = new Worker(_.filename);	
			
			worker.onmessage = function(evt) {
				element.innerHTML = evt.data;
				callback && callback.call(element);
			};
			
			worker.postMessage(language + '|' + code);
		}
		else {
			element.innerHTML = _.tokenize(code, tokens);
			callback && callback.call(element);
		}
		//console.timeEnd(code.slice(0,50));
	},
	
	tokenize: function(text, tokens) {
		var strarr = [text];
		
		var rest = tokens.rest;
		
		if (rest) {
			for (var token in rest) {
				tokens[token] = rest[token];
			}
			
			delete tokens.rest;
		}
								
		tokenloop: for (var token in tokens) {
			if(!tokens.hasOwnProperty(token) || !tokens[token]) {
				continue;
			}
			
			var pattern = tokens[token], 
				inside = pattern.inside;
			
			pattern = pattern.pattern || pattern;
			
			if(token == 'tagg') console.log(strarr.join('|'));
			
			for (var i=0; i<strarr.length; i++) {
				
				var str = strarr[i];
				
				if (strarr.length > text.length) {
					// Something went terribly wrong, ABORT, ABORT!
					break tokenloop;
				}
				
				if (str.token) {
					continue;
				}
				
				pattern.lastIndex = 0;
				
				var match = pattern.exec(str);
				
				if (match) {

					var from = match.index - 1,
					    match = match[0],
					    len = match.length,
					    to = from + len,
						before = str.slice(0, from + 1),
						after = str.slice(to + 1); 

					var wrapped = new String(
							_.wrap(
								token,
								inside? _.tokenize(match, inside) : match
							)
						);

					wrapped.token = true;
					
					var args = [i, 1];
					
					if (before) {
						args.push(before);
					}
					
					args.push(wrapped);
					
					if (after) {
						args.push(after);
					}
					
					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr.join('');
	},
	
	wrap: function(token, content) {
		var tag = 'span',
		    classes = ['token', token],
		    attributes = {};
		
		if (token === 'comment') {
			attributes['spellcheck'] = 'true';
		}
		
		// Example plugin - Will be removed
		if (token === 'entity') {
			attributes['title'] = content.replace(/&amp;/, '&');
		}
		
		// TODO Add hook here
		
		var attributesSerialized = '';
		
		for (var name in attributes) {
			attributesSerialized += name + '="' + (attributes[name] || '') + '"';
		}
		
		return '<' + tag + ' class="' + classes.join(' ') + '" ' + attributesSerialized + '>' + content + '</' + tag + '>';
	}
};

if (!self.document) {
	// In worker
	self.addEventListener('message', function(evt) {
		var message = evt.data,
			i = message.indexOf('|'),
			lang = message.slice(0,i),
			code = message.slice(i+1);
		
		self.postMessage(_.tokenize(code, _.languages[lang]));
		self.close();
	}, false);
	
	return;
}

// Get current script and highlight
var script = document.getElementsByTagName('script');

script = script[script.length - 1];

if (script) {
	_.filename = script.src;
	
	if(document.addEventListener) {
		document.addEventListener('DOMContentLoaded', _.highlightAll);
	}
	else if (window.attachEvent) {
		attachEvent('onload', _.highlightAll);
	}
}

})();