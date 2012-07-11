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
		
	highlight: function(code, useWorkers, callback) {
		if(!code) {
			return;
		}
		
		var language = (code.className.match(/language-(\w+)/i) || [])[1],
		    tokens = _.languages[language];

		if (!tokens) {
			return;
		}
		
		var text = (code.textContent || code.innerText)
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/\u00a0/g, ' ');
		
		if (useWorkers && self.Worker) {
			if(self.worker) {
				self.worker.terminate();
			}	

			var worker = new Worker(_.filename);	
			
			worker.onmessage = function(evt) {
				code.innerHTML = evt.data;
				callback && callback.call(code);
			};
			
			worker.postMessage(language + '|' + text);
		}
		else {
			code.innerHTML = _.tokenize(text, tokens);
			callback && callback.call(code);
		}
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
								
		for (var token in tokens) {
			if(!tokens.hasOwnProperty(token)) {
				continue;
			}
			
			var pattern = tokens[token], 
				inside = pattern.inside;
			
			pattern = pattern.pattern || pattern;
			
			for (var i=0; i<strarr.length; i++) {
				
				var str = strarr[i];
				
				if (str.token) {
					continue;
				}
				
				pattern.lastIndex = 0;
				
				var match = pattern.exec(str);
				
				if (match) {
					var to = pattern.lastIndex,
						match = match[0],
						len = match.length,
						from = to - len,
						before = str.slice(0, from),
						after = str.slice(to); 
					
					
					strarr.splice(i, 1);
					
					if(before) {
						strarr.splice(i++, 0, before);
					}
					
					var wrapped = new String(
							_.wrap(
								token,
								inside? _.tokenize(match, inside) : match
							)
						);

					wrapped.token = true;
					
					strarr.splice(i, 0, wrapped);
					
					if(after) {
						strarr.splice(i+1, 0, after);
					}
				}
			}
		}

		return strarr.join('');
	},
	
	wrap: function(token, content) {
		return '<span class="token ' + token + (token === 'comment'? '" spellcheck="true' : '') + '">' + content + '</span>' 
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