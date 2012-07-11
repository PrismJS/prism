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
	'regex': /\/(\\?.)+?\/[gim]{0,3}/g,
	'line-comment': /\/\/.*?(\r?\n|$)/g,
	'string': /("|')(\\?.)*?\1/g,
	'keyword': /\b(var|let|if|else|while|do|for|return|in|instanceof|function|new|with|typeof|try|catch|finally|null|break|continue)\b/g,
	'boolean': /\b(true|false)\b/g,
	'number': /\b-?(0x)?\d*\.?\d+\b/g,
	'operator': /[-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|:|\*|\//g,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[{}[\];(),.]/g
};

/*********************************************** 
     Begin prism-html.js 
***********************************************/ 

Prism.languages.html = {
	'comment': /&lt;!--[\w\W]*?--(>|&gt;)/g,
	'script': null,
	'style': null,
	'tag': {
		pattern: /(&lt;|<)\/?[\w\W]+?(>|&gt;)/gi,
		inside: {
			'attr-value': {
				pattern: /[\w:-]+=(('|").*?(\2)|[^\s>]+(?=\/?>|\/?&gt;|\s))/gi,
				inside: {
					'attr-name': /^[\w:-]+(?==)/gi,
					'punctuation': /=/g
				}
			},
			'attr-name': /\s[\w:-]+(?=\s|>|&gt;)/gi,
			'punctuation': /&lt;\/?|\/?&gt;|<\/?|\/?>/g
		}
	},
	'entity': /&amp;#?[\da-z]{1,8};/gi
};

if (Prism.languages.javascript) {
	Prism.languages.html.script = {
		pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/ig,
		inside: {
			'tag': {
				pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/ig,
				inside: Prism.languages.html.tag.inside
			},
			rest: Prism.languages.javascript
		}
	};
}
else {
	delete Prism.languages.html.script;
}

if (Prism.languages.css) {
	Prism.languages.html.style = {
		pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/ig,
		inside: {
			'tag': {
				pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/ig,
				inside: Prism.languages.html.tag.inside
			},
			rest: Prism.languages.css
		}
	};
}
else {
	delete Prism.languages.html.style;
}