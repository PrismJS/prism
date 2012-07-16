/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

(function(){

// Private helper vars
var langRegex = /lang(?:uage)?-(\w+)/i

var _ = self.Prism = {
	tokens: {
		url: /[a-z]{3,4}s?:\/\/\S+/g
	},
	
	languages: {},
		
	highlightAll: function(useWorkers, callback) {
		var elements = document.querySelectorAll('pre.prism, pre.prism > code, code.prism');

		for (var i=0, element; element = elements[i++];) {
			if (/pre/i.test(element.nodeName) && element.children.length > 0) {
				continue;
			}
			
			_.highlight(element, useWorkers === true, callback);
		}
	},
		
	highlight: function(element, useWorkers, callback) {
		if(!element) {
			return;
		}
		
		var language = (
				element.className.match(langRegex) 
				|| element.parentNode.className.match(langRegex)
				|| [])[1],
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
		
		var env = {
			element: element,
			language: language,
			tokens: tokens,
			code: code
		};
		
		_.hooks.run('before-highlight', env);
		
		if (useWorkers && self.Worker) {
			if(self.worker) {
				self.worker.terminate();
			}	

			var worker = new Worker(_.filename);	
			
			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;
				env.element.innerHTML = env.highlightedCode;
				
				callback && callback.call(env.element);
				
				_.hooks.run('after-highlight', env);
			};
			
			worker.postMessage(env.language + '|' + env.code);
		}
		else {
			env.highlightedCode = _.tokenize(env.code, env.tokens)
			env.element.innerHTML = env.highlightedCode;
			
			callback && callback.call(element);
			
			_.hooks.run('after-highlight', env);
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
				inside = pattern.inside,
				lookbehind = !!pattern.lookbehind || 0;
			
			pattern = pattern.pattern || pattern;
			
			for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop
				
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
					if(lookbehind) {
						lookbehind = match[1].length;
					}

					var from = match.index - 1 + lookbehind,
					    match = match[0].slice(lookbehind),
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
		var env = {
			token: token,
			content: content
		};
		
		env.tag = 'span';
		env.classes = ['token', token];
		env.attributes = {};
		
		if (token === 'comment') {
			env.attributes['spellcheck'] = 'true';
		}
		
		_.hooks.run('wrap', env);
		
		var attributesSerialized = '';
		
		for (var name in env.attributes) {
			attributesSerialized += name + '="' + (env.attributes[name] || '') + '"';
		}
		
		return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributesSerialized + '>' + env.content + '</' + env.tag + '>';
	},
	
	hooks: {
		all: {},
		
		add: function (name, callback) {
			var hooks = _.hooks.all;
			
			hooks[name] = hooks[name] || [];
			
			hooks[name].push(callback);
		},
		
		run: function (name, env) {
			var callbacks = _.hooks.all[name];
			
			if (!callbacks || !callbacks.length) {
				return;
			}
			
			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
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