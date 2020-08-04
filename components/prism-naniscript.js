var horSpace = /[\t ]{1}/;
var expressionDef = function (isMultiline) {
	if (isMultiline === void 0) { isMultiline = true; }
	return isMultiline
		? /\{[^\r\n\[\]{]*\}(?=[^\r\n\[\]\}]*)/m
		: /\{[^\r\n\[\]{}]*\}/;
};

Prism.languages.naniscript = {
	// ; ...
	'comment': {
		pattern: /^([\t ]*);[^\r\n]*$/m,
		lookbehind: true,
	},
	// > ...
	// Define is a control line starting with '>' followed by a word, a space and a text.
	'define': {
		pattern: /^>.+$/m,
		alias: 'tag',
		inside: {
			value: {
				pattern: /(^>[a-zA-Z0-9_]+)[\t ]{1}[^{}\r\n]+/,
				alias: 'punctuation',
				lookbehind: true,
				inside: {
					_hor_space: /^[\t ]{1}/,
					_template: /.*/,
				}
			},
			key: {
				pattern: /(^>)[a-zA-Z0-9_]+/,
				lookbehind: true,
			}
		}
	},
	// # ...
	'label': {
		pattern: /^[\t ]*[#]{1}[\t ]*[a-zA-Z0-9]+[\t ]?$/m,
		lookbehind: true,
		alias: 'regex',
		inside: {
			_hor_space: horSpace,
			value: /[^# ]+/,
		}
	},
	// Generic is any line that doesn't start with operators: ;>#@
	'generic-text': {
		pattern: /^[^#@>;\s]{1}.*$/m,
		alias: 'punctuation',
		inside: {
			// \{ ... \} ... \[ ... \] ... \"
			'escaped-char': {
				pattern: /\\[{}\[\]"]{1}/m
			},
			expression: {
				pattern: expressionDef(),
				greedy: true,
				alias: 'selector'
			},
			'inline-command': {
				pattern: /\[[\t ]*[a-zA-Z0-9_]+[^\r\n\[]*\]/m,
				greedy: true,
				alias: 'function',
				inside: {
					'quoted-string': {
						pattern: /"(?:[^"\\]|\\.)*"/
					},
					'command-param-id': {
						alias: 'property',
						pattern: /([^"\\]?)[a-zA-Z0-9_]+:/,
						lookbehind: true,
					},
					'command-param-name': {
						pattern: /^(\[)[\t ]*[a-zA-Z0-9_]+/,
						alias: 'name',
						lookbehind: true
					},
					'start-stop-char': /[\[\]]{1}/,
					'command-param-value': [
						{
							pattern: expressionDef(false),
							alias: 'selector',
						},
						{
							pattern: /([\t ]+).+?(?=[\t ]|$)/,
							alias: 'selector',
							greedy: true,
							lookbehind: true
						},
						{
							pattern: /.*/,
							alias: 'selector',
						}
					]
				}
			},
		}
	},
	'command': {
		pattern: /^([\t ]*)@[a-zA-Z0-9_]+(?=[\t ]+[\S]{1,}|[\t ]+['"][\S]|[\t ]+$|$).*/m,
		lookbehind: true,
		alias: 'function',
		inside: {
			expression: {
				pattern: expressionDef(),
				greedy: true,
				alias: 'selector'
			},
			'whitespaces': /[\t ]+$/,
			'command-name': /^[\t ]*@[a-zA-Z0-9_]+/,
			'command-params': {
				pattern: /[^\n]+$/,
				inside: {
					'quoted-string': {
						pattern: /"(?:[^"\\]|\\.)*"/,
						alias: 'selector',
					},
				
					'command-param-id': {
						alias: 'property',
						pattern: /([^"\\]?) [a-zA-Z0-9_]+:/,
						lookbehind: true,
					},
					'command-param-value': [
						{
							pattern: expressionDef(false),
							alias: 'selector',
						},
						{
							pattern: /([\t ]+).+?(?=[\t ]|$)/,
							alias: 'selector',
							greedy: true,
							lookbehind: true
						},
						{
							pattern: /.*/,
							alias: 'selector',
						}
					],
					_hor_space: horSpace
				}
			},
		}
	},
};
Prism.languages.nani = Prism.languages['naniscript'];

/**
 * This hook is used to validate generic-text tokens for balanced brackets.
 * Mark token as bad-line when contains not balanced brackets: {},[]
 */
Prism.hooks.add('after-tokenize', function (env) {
	env.tokens.map(function (token, index) {
		if (token.type === 'generic-text') {
			var content = getContents(token, []).join('');
			if (!isBracketsBalanced(content)) {
				token.type = 'bad-line';
				token.content = content;
				env.tokens[index] = token;
			}
		}
		return false;
	});
});

var isBracketsBalanced = function (input) {
	var brackets = "[]{}";
	var stack = [];
	for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
		var bracket = input_1[_i];
		var bracketsIndex = brackets.indexOf(bracket);
		if (bracketsIndex === -1) {
			continue;
		}
		if (bracketsIndex % 2 === 0) {
			stack.push(bracketsIndex + 1);
		}
		else {
			if (stack.pop() !== bracketsIndex) {
				return false;
			}
		}
	}
	return stack.length === 0;
};

function getContents(list, accumulator) {
	accumulator = accumulator || [];
	if (typeof list === 'string') {
		accumulator.push(list);
	}
	else if (typeof list.content === 'string') {
		accumulator.push(list.content);
	}
	else if (Array.isArray(list.content)) {
		list.content.forEach(function (item) {
			getContents(item, accumulator);
		});
	}
	return accumulator;
}
