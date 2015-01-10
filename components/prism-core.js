self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

var _ = self.Prism = {
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					return o.slice();
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];
			
			if (arguments.length == 2) {
				insert = arguments[1];
				
				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}
				
				return grammar;
			}
			
			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}
			
			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type) {
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object') {
						_.languages.DFS(o[i], callback);
					}
					else if (_.util.type(o[i]) === 'Array') {
						_.languages.DFS(o[i], callback, i);
					}
				}
			}
		}
	},

	highlightAll: function(async, callback) {
		var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1];
			grammar = _.languages[language];
		}

		if (!grammar) {
			return;
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		}

		var code = element.textContent;

		if(!code) {
			return;
		}

		code = code.replace(/^(?:\r\n|\r|\n)/,'');

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-highlight', env);

		if (async && self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	compileParser: function (chars) {
		var res = [],
		    vars = {},		/* start characters */
		    slVars = [],	/* single line characters */
		    endVars = {},	/* end characters */
		    escChars = {};

		if (chars.length === 0)
			return null;

		// read input array
		for (var i = 0; i < chars.length; ++i) {
			var el = chars[i],
			    start, end,		/* start, end characters */
			    multiline = true,
			    escape = 92;	/* \ backslash */

			el = typeof el === 'string' ? { start: el } : el;

			if (!el.start)
				return null;

			// expand input object
			if (typeof el.multiline !== 'undefined') {
				multiline = !!el.multiline;
			}
			if (typeof el.escape === 'string' && el.escape.length > 0) {
				escape = el.escape.charCodeAt(0);
				escChars[escape] = true;
			} else if (el.escape === false){
				escape = false;
			} else {
				escChars[92] = true;
			}

			start = el.start.charCodeAt(0);
			end = el.end ? el.end.charCodeAt(0) : start;

			// populate temporary objects
			vars[start] = { end: end, escape: escape };
			if (!multiline) {
				slVars.push(start);
			}

			if (start != end) {
				endVars[end] = start;
			}
		}

		// declare all the necessary variables
		for (var start in vars) {
			res.push('var in', start, '=', '!!this.in', start, ';');
		}

		// start for loop and switch statement
		res.push('var i=lastIndex||0,str=match.input,len=match',
			 '.index,last=this.last||0,c=last;for(;i<len;++i)',
			 '{last=c;c=str.charCodeAt(i);switch(c){');

		// add case statements for start characters
		for (var start in vars) {
			res.push('case ', start, ':', 'in', start, '=');
			for (var start2 in vars) {
				if (start != start2) {
					res.push('!in', start2, '&&');
					continue;
				}

				res.push('(');
				var sv = vars[start];
				if (start == sv.end) {
					res.push('!in', start)
					if (sv.escape !== false) {
						res.push('||', 'last === ', sv.escape);
					}
				} else {
					res.push('true');
				}
				res.push(')','&&');
			}

			res.pop();
			res.push(';break;');
		}

		// add case statements for end characters only
		// relevant if start != end
		for (var end in endVars) {
			var start = endVars[end],
			    esc = vars[start].escape;

			res.push('case ', end, ':', 'in', start, '=');
			if (esc !== false) {
				res.push('in', start, '&& last===', esc,';');
			} else {
				res.push('false;');
			}

			res.push('break;');
		}

		// set single line environments to false if \n is encounterd
		if (slVars.length > 0) {
			res.push('case 10: ');
			for (var i = 0; i < slVars.length; ++i) {
				res.push('in', slVars[i], '=false;');
			}
			res.push('break;');
		}
		
		for (var escape in escChars) {
			res.push('case ', escape, ':');
		}
		if (Object.keys(escChars).length) {
			res.push('c=0;break;');
		}

		res.push('}};');

		// store values in status object
		for (var start in vars) {
			res.push('this.in', start, '=', 'in', start, ';');
		}

		res.push('this.last=last;');

		// calculate return value
		res.push('return ');
		for (var start in vars) {
			res.push('!in', start, '&&');
		}
		res.pop();
		res.push(';');

		return new Function("match", "lastIndex", res.join(''));
	},

	generateParser: function(grammar) {
		var chars = [],
		    check = grammar.__nestingCheck;

		if (check)
			return check;

		/* collect all the start and end chars in the grammar */
		for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
				    nesting = pattern.nesting;

				if (nesting) {
					var nesting = _.util.type(nesting) === 'Array' ? nesting : [nesting];
					Array.prototype.push.apply(chars, nesting);
				}
			}
		}

		if (chars.length > 0) {
			check = _.compileParser(chars);
			Object.defineProperty(grammar, '__nestingCheck',
					      { enumerable: false, value: check });
		}

		return check;
	},

	tokenize: function(text, grammar, language) {
		var Token = _.Token,
		    strarr = [text],
		    rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		var check = _.generateParser(grammar);

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					lookbehindLength = 0,
					alias = pattern.alias,
					checkState = {};

				pattern = pattern.pattern || pattern;

				for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    lastIndex = 0;

					while(match && check) {
						if (check.call(checkState, match, lastIndex)) {
							break;
						}

						lastIndex = match.index;
						pattern.lastIndex = lastIndex + 1;
						match = pattern.exec(str);
					}

					if (match) {
						if(lookbehind) {
							lookbehindLength = match[1].length;
						}

						var from = match.index - 1 + lookbehindLength,
							match = match[0].slice(lookbehindLength),
							len = match.length,
							to = from + len,
							before = str.slice(0, from + 1),
							after = str.slice(to + 1);

						var args = [i, 1];

						if (before) {
							args.push(before);
						}

						var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias);

						args.push(wrapped);

						if (after) {
							args.push(after);
						}

						Array.prototype.splice.apply(strarr, args);
					}
				}
			}
		}

		return strarr;
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

var Token = _.Token = function(type, content, alias) {
	this.type = type;
	this.content = content;
	this.alias = alias;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (Object.prototype.toString.call(o) == '[object Array]') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = '';

	for (var name in env.attributes) {
		attributes += name + '="' + (env.attributes[name] || '') + '"';
	}

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';

};

if (!self.document) {
	if (!self.addEventListener) {
		// in Node.js
		return self.Prism;
	}
 	// In worker
	self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code;

		self.postMessage(JSON.stringify(_.util.encode(_.tokenize(code, _.languages[lang]))));
		self.close();
	}, false);

	return self.Prism;
}

// Get current script and highlight
var script = document.getElementsByTagName('script');

script = script[script.length - 1];

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		document.addEventListener('DOMContentLoaded', _.highlightAll);
	}
}

return self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}
