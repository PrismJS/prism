import { insertBefore } from '../shared/language-util';
import { rest } from '../shared/symbols';
import type { LanguageProto } from '../types';

export default {
	id: 'pure',
	grammar() {
		// https://agraef.github.io/pure-docs/pure.html#lexical-matters

		const pure = {
			'comment': [
				{
					pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
					lookbehind: true
				},
				{
					pattern: /(^|[^\\:])\/\/.*/,
					lookbehind: true
				},
				/#!.+/
			],
			'inline-lang': {
				pattern: /%<[\s\S]+?%>/,
				greedy: true,
				inside: {
					'lang': {
						pattern: /(^%< *)-\*-.+?-\*-/,
						lookbehind: true,
						alias: 'comment'
					},
					'delimiter': {
						pattern: /^%<.*|%>$/,
						alias: 'punctuation'
					},
					// C is the default inline language
					[rest]: 'c'
				}
			},
			'string': {
				pattern: /"(?:\\.|[^"\\\r\n])*"/,
				greedy: true
			},
			'number': {
				// The look-behind prevents wrong highlighting of the .. operator
				pattern: /((?:\.\.)?)(?:\b(?:inf|nan)\b|\b0x[\da-f]+|(?:\b(?:0b)?\d+(?:\.\d+)?|\B\.\d+)(?:e[+-]?\d+)?L?)/i,
				lookbehind: true
			},
			'keyword': /\b(?:NULL|ans|break|bt|case|catch|cd|clear|const|def|del|dump|else|end|exit|extern|false|force|help|if|infix[lr]?|interface|let|ls|mem|namespace|nonfix|of|otherwise|outfix|override|postfix|prefix|private|public|pwd|quit|run|save|show|stats|then|throw|trace|true|type|underride|using|when|with)\b/,
			'function': /\b(?:abs|add_(?:addr|constdef|(?:fundef|interface|macdef|typedef)(?:_at)?|vardef)|all|any|applp?|arity|bigintp?|blob(?:_crc|_size|p)?|boolp?|byte_c?string(?:_pointer)?|byte_(?:matrix|pointer)|calloc|cat|catmap|ceil|char[ps]?|check_ptrtag|chr|clear_sentry|clearsym|closurep?|cmatrixp?|cols?|colcat(?:map)?|colmap|colrev|colvector(?:p|seq)?|complex(?:_float_(?:matrix|pointer)|_matrix(?:_view)?|_pointer|p)?|conj|cookedp?|cst|cstring(?:_(?:dup|list|vector))?|curry3?|cyclen?|del_(?:constdef|fundef|interface|macdef|typedef|vardef)|delete|diag(?:mat)?|dim|dmatrixp?|do|double(?:_matrix(?:_view)?|_pointer|p)?|dowith3?|drop|dropwhile|eval(?:cmd)?|exactp|filter|fix|fixity|flip|float(?:_matrix|_pointer)|floor|fold[lr]1?|frac|free|funp?|functionp?|gcd|get(?:_(?:byte|constdef|double|float|fundef|int(?:64)?|interface(?:_typedef)?|long|macdef|pointer|ptrtag|sentry|short|string|typedef|vardef))?|globsym|hash|head|id|im|imatrixp?|index|inexactp|infp|init|insert|int(?:_matrix(?:_view)?|_pointer|p)?|int64_(?:matrix|pointer)|integerp?|iteraten?|iterwhile|join|keys?|lambdap?|last(?:err(?:pos)?)?|lcd|list[2p]?|listmap|make_ptrtag|malloc|map|matcat|matrixp?|max|member|min|nanp|nargs|nmatrixp?|null|numberp?|ord|pack(?:ed)?|pointer(?:_cast|_tag|_type|p)?|pow|pred|ptrtag|put(?:_(?:byte|double|float|int(?:64)?|long|pointer|short|string))?|rationalp?|re|realp?|realloc|recordp?|redim|reduce(?:_with)?|refp?|repeatn?|reverse|rlistp?|round|rows?|rowcat(?:map)?|rowmap|rowrev|rowvector(?:p|seq)?|same|scan[lr]1?|sentry|sgn|short_(?:matrix|pointer)|slice|smatrixp?|sort|split|str|strcat|stream|stride|string(?:_(?:dup|list|vector)|p)?|subdiag(?:mat)?|submat|subseq2?|substr|succ|supdiag(?:mat)?|symbolp?|tail|take|takewhile|thunkp?|transpose|trunc|tuplep?|typep|ubyte|uint(?:64)?|ulong|uncurry3?|unref|unzip3?|update|ushort|vals?|varp?|vector(?:p|seq)?|void|zip3?|zipwith3?)\b/,
			'special': {
				pattern: /\b__[a-z]+__\b/i,
				alias: 'builtin'
			},
			// Any combination of operator chars can be an operator
			// eslint-disable-next-line no-misleading-character-class
			'operator': /(?:[!"#$%&'*+,\-.\/:<=>?@\\^`|~\u00a1-\u00bf\u00d7-\u00f7\u20d0-\u2bff]|\b_+\b)+|\b(?:and|div|mod|not|or)\b/,
			// FIXME: How can we prevent | and , to be highlighted as operator when they are used alone?
			'punctuation': /[(){}\[\];,|]/
		};

		const inlineLanguages = [
			'c',
			{ lang: 'c++', alias: 'cpp' },
			'fortran'
		];
		const inlineLanguageRe = /%< *-\*- *<lang>\d* *-\*-[\s\S]+?%>/.source;

		inlineLanguages.forEach((item) => {
			let alias; let lang;
			if (typeof item === 'string') {
				alias = lang = item;
			} else {
				alias = item.alias;
				lang = item.lang;
			}

			insertBefore(pure, 'inline-lang', {
				['inline-lang-' + alias]: {
					pattern: RegExp(inlineLanguageRe.replace('<lang>', lang.replace(/([.+*?\/\\(){}\[\]])/g, '\\$1')), 'i'),
					inside: {
						...pure['inline-lang'].inside,
						[rest]: alias
					}
				}
			});
		});

		return pure;
	}
} as LanguageProto<'pure'>;
