/* TODO
	Add support for nested block comments...
*/

Prism.languages.applescript = {
	'comment': [
		/\(\*[\w\W]*?\*\)/,
		/--.+/,
		/#.+/
	],
	'string': /"(?:\\?.)*?"/,
	'operator': [
		/[&=≠≤≥*+\-\/÷^]|[<>]=?/,

		/\b(?:start|begin|end)s? with\b/,
		/\b(?:(?:does not|doesn't) contain|contains?)\b/,
		/\b(?:is|isn't|is not) (?:in|contained by)\b/,
		/\b(?:(?:is|isn't|is not) )?(?:greater|less) than(?: or equal)?(?: to)?\b/,
		/\b(?:(?:does not|doesn't) come|comes) (?:before|after)\b/,
		/\b(?:is|isn't|is not) equal(?: to)?\b/,
		/\b(?:(?:does not|doesn't) equal|equals|equal to|isn't|is not)\b/,
		/\b(?:a )?(?:ref(?: to)?|reference to)\b/,
		/\b(?:and|or|div|mod|as|not)\b/
	],
	'keyword': /\b(?:about|above|after|against|and|apart from|around|as|aside from|at|back|before|beginning|behind|below|beneath|beside|between|but|by|considering|contain|contains|continue|copy|div|does|eighth|else|end|equal|equals|error|every|exit|false|fifth|first|for|fourth|from|front|get|given|global|if|ignoring|in|instead of|into|is|it|its|last|local|me|middle|mod|my|ninth|not|of|on|onto|or|out of|over|prop|property|put|ref|reference|repeat|return|returning|script|second|set|seventh|since|sixth|some|tell|tenth|that|the|then|third|through|thru|timeout|times|to|transaction|true|try|until|where|while|whose|with|without)\b/g,
	'class': [
		{
			pattern: /\b(?:alias|application|boolean|class|constant|date|file|integer|list|number|POSIX file|real|record|reference|RGB color|script|text)\b/,
			alias: 'builtin'
		},
		{
			pattern: /\b(?:centimetres|centimeters|feet|inches|kilometres|kilometers|metres|meters|miles|yards|square feet|square kilometres|square kilometers|square metres|square meters|square miles|square yards|cubic centimetres|cubic centimeters|cubic feet|cubic inches|cubic metres|cubic meters|cubic yards|gallons|litres|liters|quarts|grams|kilograms|ounces|pounds|degrees Celsius|degrees Fahrenheit|degrees Kelvin)\b/,
			alias: 'builtin'
		}
	],
	'number': /\b-?\d*\.?\d+([Ee]-?\d+)?\b/,
	'punctuation': /[{}():,¬«»《》]/
};