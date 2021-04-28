Prism.languages.rpg = {
	comment: [
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true,
			greedy: true,
		},
	],
	string: {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true,
	},
	keyword: /(?:\*empty|\*blanks|\*zero|\*nopass|\*omit|dsply|\*\*free|\**inlr|\*entry|eval-corr|eval|likeds|like|read|dpsly|if|dcl-f|endif|write|const|actgrp|dftactgrp|extproc|extpgm|options|value|val|class|select|where|include|exec sql|iter|else|not|while|dow|do|for|endfor|leave|return|dcl-pi|end-ds|end-pi|null|break|inz|switch|case)/i,
	boolean: /(?:\*on|\*off)/i,
	builtin: /\b(?:dcl-s|dcl-c)\b/i,
	"class-name": /\b(?:varchar|date|time|packed|graph|vargraph|char|ucs2|varucs2|float|indicator|byte|bindec|pointer)\b/i,
	function: /(?:dcl-proc|end-proc|%abs|%addr|%alloc|%bitand|%bitnot|%bitor|%bitxor|%char|%checkr|%check|%data|%date|%days|%dech|%decpos|%dec|%diff|%div|%editc|%editflt|%editw|%elem|%eof|%equal|%error|%fields|%float|%found|%graph|%handler|%hours|%inth|%int|%kds|%len|%lookup|%max|%min|%minutes|%months|%mseconds|%nullind|%occur|%open|%paddr|%parms|%parmnum|%parser|%proc|%realloc|%rem|%replace|%scanrpl|%scan|%seconds|%shtdn|%size|%sqrt|%status|%str|%subarr|%subdt|%subst|%this|%timestamp|%time|%tlookupxx|%triml|%trimr|%trim|%ucs2|%unsh|%uns|%xfoot|%xlate|%xml|%years)/i,
	number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
	operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?/,
	punctuation: /[{}[\];(),.:]/,
};
