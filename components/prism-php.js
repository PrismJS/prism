/**
 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
 * Modified by Miles Johnson: http://milesj.me
 *
 * Supports the following:
 * 		- Extends clike syntax
 * 		- Support for PHP 5.3+ (namespaces, traits, generators, etc)
 * 		- Smarter constant and function matching
 *
 * Adds the following new token classes:
 * 		constant, delimiter, variable, function, package
 */
(function (Prism) {
	Prism.languages.php = Prism.languages.extend('clike', {
		'keyword': /\b(?:__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|parent|print|private|protected|public|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield)\b/i,
		'boolean': {
			pattern: /\b(?:false|true)\b/i,
			alias: 'constant'
		},
		'constant': [
			/\b[A-Z_][A-Z0-9_]*\b/,
			/\b(?:null)\b/i,
		],
		'comment': {
			pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
			lookbehind: true
		},
		'class-name': {
			pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s+\()\b[a-zA-Z_][\w]*(?!\\)\b/i,
			lookbehind: true,
		},
		'number': /\b0b[01]+\b|\b0x[\da-f]+\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)*|\B\.\d+)(?:e[+-]?\d+)?/i,
		'operator': /<?=>|\?\?=?|\.{3}|->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||[?~]|[/^|%*&<>.+-]=?/,
		'punctuation': /[{}\[\](),:;]/
	});

	Prism.languages.insertBefore('php', 'string', {
		'shell-comment': {
			pattern: /(^|[^\\])#.*/,
			lookbehind: true,
			alias: 'comment'
		}
	});

	Prism.languages.insertBefore('php', 'comment', {
		'delimiter': {
			pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
			alias: 'important'
		}
	});

	// Must be defined before class-name (because primitive types must be matched before class names in function typehint)
	Prism.languages.insertBefore('php', 'class-name', {
		'variable': /\$+(?:\w+\b|(?={))/i,
		'package': {
			pattern: /(namespace\s+|use\s+(?:function\s+)?)(?:\\*\b[a-zA-Z_][\w]*)+\b(?!\\)/i,
			lookbehind: true,
			inside: {
				punctuation: /\\/
			}
		},
		'type type-casting': {
			pattern: /(\(\s*)\b(?:bool|boolean|int|integer|float|string|object|array(?!\s*\())\b(?=\s*\))/i,
			greedy: true,
			lookbehind: true
		},
		'type type-hint': {
			pattern: /([(,?]\s*)\b(?:bool|boolean|int|integer|float|string|object|array(?!\s*\()|mixed|self|static)\b(?=\s*\$)/i,
			greedy: true,
			lookbehind: true
		},
		'type return-type': {
			pattern: /(\)\s*:\s*\?*\s*)\b(?:bool|boolean|int|integer|float|string|object|void|array(?!\s*\()|mixed|self|static)\b/i,
			greedy: true,
			lookbehind: true
		},
		'type': {
			pattern: /\b(?:bool|boolean|int|integer|float|string|object|void|array(?!\s*\()|mixed)\b/i,
			greedy: true
		}
	});

	// Must be defined after the function pattern
	Prism.languages.insertBefore('php', 'operator', {
		'property': {
			pattern: /(->)[\w]+/,
			lookbehind: true
		}
	});

	var string_interpolation = {
		pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)*)/,
		lookbehind: true,
		inside: Prism.languages.php
	};

	Prism.languages.insertBefore('php', 'string', {
		'nowdoc-string': {
			pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
			greedy: true,
			alias: 'string',
			inside: {
				'delimiter': {
					pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
					alias: 'symbol',
					inside: {
						'punctuation': /^<<<'?|[';]$/
					}
				}
			}
		},
		'heredoc-string': {
			pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
			greedy: true,
			alias: 'string',
			inside: {
				'delimiter': {
					pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
					alias: 'symbol',
					inside: {
						'punctuation': /^<<<"?|[";]$/
					}
				},
				'interpolation': string_interpolation // See below
			}
		},
		'backtick-quoted-string': {
			pattern: /`(?:\\[\s\S]|[^\\`])*`/,
			greedy: true,
			alias: 'string'
		},
		'single-quoted-string': {
			pattern: /'(?:\\[\s\S]|[^\\'])*'/,
			greedy: true,
			alias: 'string'
		},
		'double-quoted-string': {
			pattern: /"(?:\\[\s\S]|[^\\"])*"/,
			greedy: true,
			alias: 'string',
			inside: {
				'interpolation': string_interpolation // See below
			}
		}
	});
	// The different types of PHP strings "replace" the C-like standard string
	delete Prism.languages.php['string'];

	Prism.languages.insertBefore('php', 'keyword', {
		'keyword static-context': {
			pattern: /\b(?:parent|self|static)(?=\s*::)/i,
			greedy: true
		}
	});

	Prism.languages.insertBefore('php', 'boolean', {
		'class-name class-name-fully-qualified': {
			pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s+\()(?:\\*\b[a-zA-Z_][\w]*)+\b(?!\\)/i,
			greedy: true,
			inside: {
				punctuation: /\\/
			},
			lookbehind: true
		},
		'class-name static-context': {
			pattern: /\b[a-zA-Z_][\w]*(?!\\)\b(?=\s*::)/i,
			greedy: true,
		},
		'class-name class-name-fully-qualified static-context': {
			pattern: /(?:\\*\b[a-zA-Z_][\w]*)+\b(?!\\)(?=\s*::)/i,
			greedy: true,
			inside: {
				punctuation: /\\/
			}
		},
		'class-name type-hint': {
			pattern: /([(,?]\s*)\b[a-zA-Z_][\w]*(?!\\)\b(?=\s*\$)/i,
			greedy: true,
			lookbehind: true
		},
		'class-name class-name-fully-qualified type-hint': {
			pattern: /([(,?]\s*)(?:\\*\b[a-zA-Z_][\w]*)+\b(?!\\)(?=\s*\$)/i,
			greedy: true,
			inside: {
				punctuation: /\\/
			},
			lookbehind: true
		},
		'class-name return-type': {
			pattern: /(\)\s*:\s*\?*\s*)\b[a-zA-Z_][\w]*(?!\\)\b/i,
			greedy: true,
			lookbehind: true
		},
		'class-name class-name-fully-qualified return-type': {
			pattern: /(\)\s*:\s*\?*\s*)(?:\\*\b[a-zA-Z_][\w]*)+\b(?!\\)/i,
			greedy: true,
			inside: {
				punctuation: /\\/
			},
			lookbehind: true
		}
	});

	Prism.hooks.add('before-tokenize', function(env) {
		if (!/<\?/.test(env.code)) {
			return;
		}

		var phpPattern = /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#)(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|\/\*[\s\S]*?(?:\*\/|$))*?(?:\?>|$)/ig;
		Prism.languages['markup-templating'].buildPlaceholders(env, 'php', phpPattern);
	});

	Prism.hooks.add('after-tokenize', function(env) {
		Prism.languages['markup-templating'].tokenizePlaceholders(env, 'php');
	});

}(Prism));
