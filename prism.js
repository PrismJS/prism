

/*********************************************** 
     Begin prism-core.js 
***********************************************/ 

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

/*********************************************** 
     Begin prism-css.js 
***********************************************/ 

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//g,
	'atrule': /@[\w-]+?(\s+.+)?(?=\s*{|\s*;)/gi,
	'selector': /[^\{\}\s][^\{\}]*(?=\s*\{)/g,
	'property': /(\b|\B)[a-z-]+(?=\s*:)/ig,
	'important': /\B!important\b/gi,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[\{\};:]/g
};

/*********************************************** 
     Begin prism-javascript.js 
***********************************************/ 

Prism.languages.javascript = {
	'comment': /\/\*[\w\W]*?\*\//g,
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}/g,
		lookbehind: true
	},
	'line-comment': /\/\/.*?(\r?\n|$)/g,
	'string': /("|')(\\?.)*?\1/g,
	'keyword': /\b(var|let|if|else|while|do|for|return|in|instanceof|function|new|with|typeof|try|catch|finally|null|break|continue)\b/g,
	'boolean': /\b(true|false)\b/g,
	'number': /\b-?(0x)?\d*\.?\d+\b/g,
	'operator': /[-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\//g,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[{}[\];(),.:]/g,
	'tab': /\t/g
};

/*********************************************** 
     Begin prism-markup.js 
***********************************************/ 

Prism.languages.markup = {
	'comment': /&lt;!--[\w\W]*?--(>|&gt;)/g,
	'prolog': /&lt;\?.+?\?(>|&gt;)/,
	'doctype': /&lt;!DOCTYPE.+?(>|&gt;)/,
	'script': null,
	'style': null,
	'cdata': /&lt;!\[CDATA\[[\w\W]+]]&gt;/i,
	'tag': {
		pattern: /(&lt;|<)\/?[\w:-]+\s*[\w\W]*?(>|&gt;)/gi,
		inside: {
			'tag': {
				pattern: /^(&lt;|<)\/?[\w:-]+/i,
				inside: {
					'punctuation': /^(&lt;|<)\/?/,
					'namespace': /^[\w-]+?:/
				}
			},
			'attr-value': {
				pattern: /=(('|")[\w\W]*?(\2)|[^\s>]+)/gi,
				inside: {
					'punctuation': /=/g
				}
			},
			'punctuation': /\/?&gt;|\/?>/g,
			'attr-name': {
				pattern: /[\w:-]+/g,
				inside: {
					'namespace': /^[\w-]+?:/
				}
			}
			
		}
	},
	'entity': /&amp;#?[\da-z]{1,8};/gi
};

if (Prism.languages.javascript) {
	Prism.languages.markup.script = {
		pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/ig,
		inside: {
			'tag': {
				pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/ig,
				inside: Prism.languages.markup.tag.inside
			},
			rest: Prism.languages.javascript
		}
	};
}
else {
	delete Prism.languages.markup.script;
}

if (Prism.languages.css) {
	Prism.languages.markup.style = {
		pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/ig,
		inside: {
			'tag': {
				pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/ig,
				inside: Prism.languages.markup.tag.inside
			},
			rest: Prism.languages.css
		}
	};
}
else {
	delete Prism.languages.markup.style;
}

// Plugin to make entity title show the real entity
Prism.hooks.add('wrap', function(env) {

	if (env.token === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});