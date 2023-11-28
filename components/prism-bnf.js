/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['bnf']) {
      return
    }
	Prism.languages.bnf = {
		'string': {
			pattern: /"[^\r\n"]*"|'[^\r\n']*'/
		},
		'definition': {
			pattern: /<[^<>\r\n\t]+>(?=\s*::=)/,
			alias: ['rule', 'keyword'],
			inside: {
				'punctuation': /^<|>$/
			}
		},
		'rule': {
			pattern: /<[^<>\r\n\t]+>/,
			inside: {
				'punctuation': /^<|>$/
			}
		},
		'operator': /::=|[|()[\]{}*+?]|\.{3}/
	};

	Prism.languages.rbnf = Prism.languages.bnf;
}