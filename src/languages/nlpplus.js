/**
 * NLP++, the programming language for natural language processing
 * (https://visualtext.org/nlp/). An analyzer is a sequence of passes; each
 * pass matches pattern rules against a parse tree and runs code when a rule
 * fires.
 *
 * Built-in functions are highlighted only when called, because the same words
 * (next, single, str, ...) also appear as literal text in rules. The list is
 * the engine's own (nlpFuncs[] in lite/funcs.h) and matches case exactly, as
 * the engine does: a user function AddWord is not the built-in addword.
 * Keywords (if, else, while, return) are case-insensitive in the engine.
 *
 * @type {import('../types.d.ts').LanguageProto<'nlpplus'>}
 */
export default {
	id: 'nlpplus',
	alias: 'nlp',
	grammar () {
		const string = /"(?:\\.|[^"\\\r\n])*"/;
		// \# is a literal pound sign in a rule, not a comment
		const lineComment = /(?<!\\)#.*/;
		// Special node names that match classes of text: _xWILD, _xALPHA ...
		const constant =
			/\b_(?:ROOT|xALPHA|xANY|xBLANK|xCAP|xCAPLET|xCTRL|xEMOJI|xEND|xEOF|xLET|xNIL|xNUM|xPUNCT|xSTART|xVAR|xWHITE|xWILD)\b/;
		// Every other leading-underscore name is a parse-tree node: _noun, _money,
		// and also _34 or _café (letters, digits and _ in any script).
		const node = {
			pattern: /\b_[\p{L}\p{N}_]+/u,
			alias: 'class-name',
		};
		// A literal character in a rule is backslash-escaped: \. \, \-
		const char = /\\./;

		return {
			'comment': [
				{ pattern: /\/\*[\s\S]*?\*\//, greedy: true },
				{ pattern: lineComment, greedy: true },
			],
			'string': {
				pattern: string,
				greedy: true,
			},
			// @RULES, @POST, @CODE ... and their closing @@ forms. These are the 12
			// markers the engine's pass-file tokenizer knows (data/rfb/spec/bigtok.nlp);
			// any other @NAME is a syntax error. Like every rule literal, they ignore case.
			'region': {
				pattern:
					/@@?(?:CHECK|CODE|DECL|MULTI|NODES|PATH|POST|POSTCODE|PRE|RECURSE|RULES|SELECT)\b/i,
				alias: 'keyword',
			},
			// A bare @@ ends one rule, as ; ends a statement (the tokenizer's _ENDRULE).
			'rule-end': {
				pattern: /@@/,
				alias: 'punctuation',
			},
			'arrow': {
				pattern: /<-/,
				alias: 'operator',
			},
			// The modifiers after a rule element: [opt], [s], [min=2 match=(_xCAP _xNUM)],
			// [one vareq=("pos" "noun")]. They may hold strings and escaped brackets
			// (match=( \] \) )) and span lines. Not after ")": G("x")[0] is an array index.
			'modifiers': {
				pattern: /(?<!\))\[(?:\\.|"(?:\\.|[^"\\\r\n])*"|[^[\]\\"])*\]/,
				greedy: true,
				inside: {
					// A value list: match=(one two). Its words are literals, never keys.
					// A list that spans lines may hold # comments.
					'value-list': {
						pattern: /\((?:\\.|"(?:\\.|[^"\\\r\n])*"|[^()\\"])*\)/,
						inside: {
							'string': string,
							'comment': lineComment,
							'constant': constant,
							'node': node,
							'char': char,
							'punctuation': /[()]/,
						},
					},
					'string': string,
					// The keys the engine accepts (lite/ielt.cpp). Most ignore case; the
					// abbreviations da, dcc, deacc, dj, look, s and xs must be lowercase.
					'attr-name': [
						/\b(?:attrs?|base|cap|deaccent|debug|dejunk|excepts?|fails?|gp|group|layers?|length|lengthr|lookahead|lowercase|match(?:es)?|max|min|nest|numrange|o|one|opt(?:ion(?:al)?)?|pass(?:es)?|plus|recurse|regexpi?|ren(?:ame)?|singlet|star|t|tree|trig(?:ger)?|unknown|unsealed|uppercase|var|vareq|vargt|varlt|varne|varz|xsinglet|xt|xtree)\b/i,
						/\b(?:da|dcc|deacc|dj|look|s|xs)\b/,
					],
					'constant': constant,
					'node': node,
					'char': char,
					'number': /\b\d+\b/,
					'operator': /=/,
					'punctuation': /[[\]]/,
				},
			},
			'char': char,
			'constant': constant,
			'node': node,
			// N("x"), S("x"), X("x"), G("x"), L("x"): node, semantic, context,
			// global and local variables.
			'accessor': {
				pattern: /\b[GLNSX](?=\s*\()/,
				alias: 'variable',
			},
			'builtin':
				/\b(?:DICTphraselookup|LJ|abs|addarg|addattr|addcnode|addconcept|addconval|addnode|addnumval|addstmt|addstrs|addstrval|addsval|addword|adoptconcepts|arraylength|arrayreverse|arrayslice|arraysort|arrayunique|attrchange|attrexists|attrname|attrtype|attrvals|attrwithval|batchstart|callanalyzer|callconcept|cap|cbuf|ceiling|closefile|conceptname|conceptpath|conval|cout|coutreset|dballocstmt|dbbindcol|dbclose|dbexec|dbexecstmt|dbfetch|dbfreestmt|dbopen|deaccent|debug|dejunk|deletefile|dictfindword|dictfirst|dictgetword|dictnext|direxists|dirlist|down|eltnode|excise|exitpass|exittopopup|factorial|fail|fileexists|fileout|filesize|findana|findattr|findattrs|findconcept|findhierconcept|findnode|findphrase|findroot|findvals|findwordpath|firstnode|floor|flt|fltval|fncallstart|fprintgvar|fprintnvar|fprintvar|fprintxvar|gdump|getconcept|getconval|getfltval|getnumval|getpopupdata|getstrval|getsval|ginc|gp|group|gtolower|guniq|hitconf|inc|inheritval|inputrange|inputrangetofile|interactive|isarray|iscon|isfloat|isnum|ispn|isstr|jsonparse|jsonwrite|kbdumptree|lasteltnode|lastnode|length|lengthr|levenshtein|lextagger|listadd|listnode|lj|loaddict|loadkbb|log|logten|look|lookup|lowercase|makeconcept|makeliteral|makeparentconcept|makephrase|makestmt|merge|merger|mkdir|mod|movecleft|moveconcept|movecright|movesem|ndump|next|nextattr|nextval|ninc|nodeconcept|nodeowner|noop|num|numrange|numval|openfile|or|pathconcept|percentstr|permuten|phraselength|phraseraw|phrasetext|pncopyvars|pndeletechilds|pndown|pninsert|pnmakevar|pnmove|pnname|pnnext|pnprev|pnpush|pnpushval|pnremoveval|pnrename|pnreplaceval|pnroot|pnrpushval|pnsetfired|pnsingletdown|pntype|pnup|pnvar|pnvarnames|pnvartype|pow|pranchor|prchild|preaction|prev|print|printr|printvar|prlit|prrange|prtree|prunephrases|prxtree|push|randomint|readfile|readlines|refind|regexp|regexpi|rematch|renameattr|renamechild|renameconcept|renamenode|replaceval|resolveurl|resubst|returnstmt|rfaaction|rfaactions|rfaarg|rfaargtolist|rfacode|rfaelement|rfaelt|rfaexpr|rfalist|rfalitelt|rfalittoaction|rfalittopair|rfaname|rfanodes|rfanonlit|rfanonlitelt|rfanum|rfaop|rfapair|rfapairs|rfapostunary|rfapres|rfarange|rfarecurse|rfarecurses|rfaregion|rfaregions|rfarule|rfarulelts|rfarulemark|rfarules|rfarulesfile|rfaselect|rfastr|rfasugg|rfaunary|rfavar|rfaxvar|rfbarg|rfbdecl|rfbdecls|rightjustifynum|rmattr|rmattrs|rmattrval|rmchars|rmchild|rmchildren|rmconcept|rmcphrase|rmnode|rmphrase|rmval|rmvals|rmword|round|sdump|setbase|setlookahead|setunsealed|single|singler|singlex|singlezap|sortattrs|sortchilds|sortconsbyattr|sorthier|sortphrase|sortvals|spellcandidates|spellcorrect|spellword|splice|split|sqlstr|sqrt|startout|stem|stopout|str|strchar|strchr|strchrcount|strclean|strcontains|strcontainsnocase|strendswith|strequal|strequalnocase|strescape|strgreaterthan|strhaspunct|strindexof|strisalpha|striscaps|strisdigit|strislower|strisupper|strjoin|strlastindexof|strlength|strlessthan|strnotequal|strnotequalnocase|strpiece|strrchr|strspellcandidate|strspellcompare|strstartswith|strsubst|strtolower|strtotitle|strtoupper|strtrim|strunescape|struniquechars|strval|strwrap|succeed|suffix|system|take|today|topdir|truncate|unknown|unpackdirs|up|uppercase|urlbase|urltofile|var|vareq|varfn|varfnarray|vargt|varinlist|varlt|varne|varstrs|varz|wnhypnymstoconcept|wninit|wnsensestoconcept|wordindex|wordpath|writekb|xaddlen|xaddnvar|xdump|xinc|xmlstr|xrename)\b(?=\s*\()/,
			'keyword': /\b(?:else|if|return|while)\b/i,
			'function': /\b[a-z]\w*(?=\s*\()/i,
			'number': /\b\d+(?:\.\d+)?\b/,
			'operator': /<<|&&|\|\||\+\+|--|%%|[!=<>]=?|[-+*/%]/,
			'punctuation': /[{}[\]();,]/,
		};
	},
};
