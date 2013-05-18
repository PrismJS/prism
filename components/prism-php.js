/**
 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
 * Modified by Miles Johnson: http://milesj.me
 *
 * Supports the following:
 * 		- Extends clike syntax
 * 		- Support for PHP 5.3 and 5.4 (namespaces, traits, etc)
 * 		- Smarter constant and function matching
 *
 * Adds the following new token classes:
 * 		constant, deliminator, variable, function, scope, package, this
 */

Prism.languages.php = Prism.languages.extend('clike', {
	'keyword': /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|extends|private|protected|parent|static|throw|null|echo|print|trait|namespace|use|final|yield|goto)\b/ig,
	'constant': /[A-Z0-9_]{2,}/g
});

Prism.languages.insertBefore('php', 'keyword', {
	'deliminator': /(\?>|\?&gt;|&lt;\?php|<\?php)/ig,
	'this': /\$this/,
	'variable': /(\$\w+)\b/ig,
	'scope': {
		pattern: /\b[a-z0-9_\\]+::/ig,
		inside: {
			keyword: /(static|self|parent)/,
			punctuation: /(::|\\)/
		}
	},
	'package': {
		pattern: /(\\|namespace\s+|use\s+)[a-z0-9_\\]+/ig,
		lookbehind: true,
		inside: {
			punctuation: /\\/
		}
	}
});

Prism.languages.insertBefore('php', 'operator', {
	'property': {
		pattern: /(-&gt;)[a-z0-9_]+/ig,
		lookbehind: true
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('php', 'comment', {
		'markup': {
			pattern: /(\?>|\?&gt;)[\w\W]*?(?=(&lt;\?php|<\?php))/ig,
			lookbehind : true,
			inside: {
				'markup': {
					pattern: /&lt;\/?[\w:-]+\s*[\w\W]*?&gt;/gi,
					inside: Prism.languages.markup.tag.inside
				},
				rest: Prism.languages.php
			}
		}
	});
}