import type { LanguageProto } from '../types';

export default {
	id: 'batch',
	grammar() {
		const variable = /%%?[~:\w]+%?|!\S+!/;
		const parameter = {
			pattern: /\/[a-z?]+(?=[ :]|$):?|-[a-z]\b|--[a-z-]+\b/im,
			alias: 'attr-name',
			inside: {
				'punctuation': /:/
			}
		};
		const string = /"(?:[\\"]"|[^"])*"(?!")/;
		const number = /(?:\b|-)\d+\b/;

		return {
			'comment': [
				/^::.*/m,
				{
					pattern: /((?:^|[&(])[ \t]*)rem\b(?:[^^&)\r\n]|\^(?:\r\n|[\s\S]))*/im,
					lookbehind: true
				}
			],
			'label': {
				pattern: /^:.*/m,
				alias: 'property'
			},
			'command': [
				{
					// FOR command
					pattern: /((?:^|[&(])[ \t]*)for(?: \/[a-z?](?:[ :](?:"[^"]*"|[^\s"/]\S*))?)* \S+ in \([^)]+\) do/im,
					lookbehind: true,
					inside: {
						'keyword': /\b(?:do|in)\b|^for\b/i,
						'string': string,
						'parameter': parameter,
						'variable': variable,
						'number': number,
						'punctuation': /[()',]/
					}
				},
				{
					// IF command
					pattern: /((?:^|[&(])[ \t]*)if(?: \/[a-z?](?:[ :](?:"[^"]*"|[^\s"/]\S*))?)* (?:not )?(?:cmdextversion \d+|defined \w+|errorlevel \d+|exist \S+|(?:"[^"]*"|(?!")(?:(?!==)\S)+)?(?:==| (?:equ|geq|gtr|leq|lss|neq) )(?:"[^"]*"|[^\s"]\S*))/im,
					lookbehind: true,
					inside: {
						'keyword': /\b(?:cmdextversion|defined|errorlevel|exist|not)\b|^if\b/i,
						'string': string,
						'parameter': parameter,
						'variable': variable,
						'number': number,
						'operator': /\^|==|\b(?:equ|geq|gtr|leq|lss|neq)\b/i
					}
				},
				{
					// ELSE command
					pattern: /((?:^|[&()])[ \t]*)else\b/im,
					lookbehind: true,
					inside: {
						'keyword': /^else\b/i
					}
				},
				{
					// SET command
					pattern: /((?:^|[&(])[ \t]*)set(?: \/[a-z](?:[ :](?:"[^"]*"|[^\s"/]\S*))?)* (?:[^^&)\r\n]|\^(?:\r\n|[\s\S]))*/im,
					lookbehind: true,
					inside: {
						'keyword': /^set\b/i,
						'string': string,
						'parameter': parameter,
						'variable': [
							variable,
							/\w+(?=(?:[*\/%+\-&^|]|<<|>>)?=)/
						],
						'number': number,
						'operator': /[*\/%+\-&^|]=?|<<=?|>>=?|[!~_=]/,
						'punctuation': /[()',]/
					}
				},
				{
					// Other commands
					pattern: /((?:^|[&(])[ \t]*@?)\w+\b(?:"(?:[\\"]"|[^"])*"(?!")|[^"^&)\r\n]|\^(?:\r\n|[\s\S]))*/m,
					lookbehind: true,
					inside: {
						'keyword': /^\w+\b/,
						'string': string,
						'parameter': parameter,
						'label': {
							pattern: /(^\s*):\S+/m,
							lookbehind: true,
							alias: 'property'
						},
						'variable': variable,
						'number': number,
						'operator': /\^/
					}
				}
			],
			'operator': /[&@]/,
			'punctuation': /[()']/
		};
	}
} as LanguageProto<'batch'>;
