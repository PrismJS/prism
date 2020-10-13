/**
 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
 * Modified by Miles Johnson: http://milesj.me
 * Rewritten by Tom Pavelec
 *
 * Supports PHP 5.3 - 7.4
 */
(function (Prism) {
	Prism.languages.php = {
		'delimiter': {
			pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
			alias: 'important'
		},
		'comment': [
			/\/\*[\s\S]*?\*\/|\/\/.*|#.*/
		],
		'variable': /\$+(?:\w+\b|(?={))/i,
		'package': {
			pattern: /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
			lookbehind: true,
			inside: {
				'punctuation': /\\/
			}
		},
		'keyword': [
			{
				pattern: /(\(\s*)\b(?:bool|boolean|int|integer|float|string|object|array)\b(?=\s*\))/i,
				alias: 'type-casting',
				greedy: true,
				lookbehind: true
			},
			{
				pattern: /([(,?]\s*)\b(?:bool|boolean|int|integer|float|string|object|array(?!\s*\()|mixed|self|static|callable|iterable)\b(?=\s*\$)/i,
				alias: 'type-hint',
				greedy: true,
				lookbehind: true
			},
			{
				pattern: /(\)\s*:\s*\?*\s*)\b(?:bool|boolean|int|integer|float|string|object|void|array(?!\s*\()|mixed|self|static|callable|iterable)\b/i,
				alias: 'return-type',
				greedy: true,
				lookbehind: true
			},
			{
				pattern: /\b(?:bool|boolean|int|integer|float|string|object|void|array(?!\s*\()|mixed|iterable)\b/i,
				alias: 'type-declaration',
				greedy: true
			},
			{
				pattern: /\b(?:parent|self|static)(?=\s*::)/i,
				alias: 'static-context',
				greedy: true
			},
			/\b(?:__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|match|new|or|parent|print|private|protected|public|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield)\b/i
		],
		'class-name': [
			{
				pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s+\()\b[a-z_]\w*(?!\\)\b/i,
				greedy: true,
				lookbehind: true
			},
			{
				pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s+\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
				alias: 'class-name-fully-qualified',
				greedy: true,
				lookbehind: true,
				inside: {
					'punctuation': /\\/
				}
			},
			{
				pattern: /\b[a-z_]\w*(?=\s*\$)/i,
				alias: 'type-declaration',
				greedy: true
			},
			{
				pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
				alias: ['class-name-fully-qualified', 'type-declaration'],
				greedy: true,
				inside: {
					'punctuation': /\\/
				}
			},
			{
				pattern: /\b[a-z_]\w*(?=\s*::)/i,
				alias: 'static-context',
				greedy: true
			},
			{
				pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
				alias: ['class-name-fully-qualified', 'static-context'],
				greedy: true,
				inside: {
					'punctuation': /\\/
				}
			},
			{
				pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
				alias: 'type-hint',
				greedy: true,
				lookbehind: true
			},
			{
				pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
				alias: ['class-name-fully-qualified', 'type-hint'],
				greedy: true,
				lookbehind: true,
				inside: {
					'punctuation': /\\/
				}
			},
			{
				pattern: /(\)\s*:\s*\?*\s*)\b[a-z_]\w*(?!\\)\b/i,
				alias: 'return-type',
				greedy: true,
				lookbehind: true
			},
			{
				pattern: /(\)\s*:\s*\?*\s*)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
				alias: ['class-name-fully-qualified', 'return-type'],
				greedy: true,
				lookbehind: true,
				inside: {
					'punctuation': /\\/
				}
			}
		],
		'constant': [
			{
				pattern: /\b(?:false|true)\b/i,
				alias: 'boolean'
			},
			/\b[A-Z_][A-Z0-9_]*\b/,
			/\b(?:null)\b/i,
		],
		'function': /\w+\s*(?=\()/,
		'property': {
			pattern: /(->)[\w]+/,
			lookbehind: true
		},
		'number': /\b0b[01]+\b|\b0x[\da-f]+\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)*|\B\.\d+)(?:e[+-]?\d+)?/i,
		'operator': /<?=>|\?\?=?|\.{3}|->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||[?~]|[/^|%*&<>.+-]=?/,
		'punctuation': /[{}\[\](),:;]/
	};

	var string_interpolation = {
		pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)*)/,
		lookbehind: true,
		inside: Prism.languages.php
	};

	Prism.languages.insertBefore('php', 'variable', {
		'string': [
			{
				pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
				alias: 'nowdoc-string',
				greedy: true,
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
			{
				pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
				alias: 'heredoc-string',
				greedy: true,
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
			{
				pattern: /`(?:\\[\s\S]|[^\\`])*`/,
				alias: 'backtick-quoted-string',
				greedy: true
			},
			{
				pattern: /'(?:\\[\s\S]|[^\\'])*'/,
				alias: 'single-quoted-string',
				greedy: true
			},
			{
				pattern: /"(?:\\[\s\S]|[^\\"])*"/,
				alias: 'double-quoted-string',
				greedy: true,
				inside: {
					'interpolation': string_interpolation // See below
				}
			}
		],
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
