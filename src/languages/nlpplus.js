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
	grammar: {
		'comment': [
			{ pattern: /\/\*[\s\S]*?\*\//, greedy: true },
			{ pattern: /#.*/, greedy: true },
		],
		'string': {
			pattern: /"(?:\\.|[^"\\\r\n])*"/,
			greedy: true,
		},
		// @RULES, @POST, @CODE ... and their closing @@ forms; a bare @@ ends a rule.
		// These are the 12 markers the engine's pass-file tokenizer knows
		// (data/rfb/spec/bigtok.nlp); any other @NAME is a syntax error.
		'region': {
			pattern:
				/@@?(?:CHECK|CODE|DECL|MULTI|NODES|PATH|POST|POSTCODE|PRE|RECURSE|RULES|SELECT)\b|@@/,
			alias: 'keyword',
		},
		'arrow': {
			pattern: /<-/,
			alias: 'operator',
		},
		// The modifiers after a rule element: [opt], [s], [min=2 match=(_xCAP _xNUM)].
		'modifiers': {
			pattern: /\[[^[\]\r\n]*\]/,
			inside: {
				'attr-name':
					/\b(?:attrs?|base|da|deacc(?:ent)?|excepts?|fails?|gp|group|layers?|look(?:ahead)?|match(?:es)?|max|min|nest|o|one|opt(?:ion(?:al)?)?|pass(?:es)?|plus|recurse|ren(?:ame)?|s|singlet|star|t|tree|trig(?:ger)?|unsealed)\b/i,
				'constant':
					/\b_(?:ROOT|xALPHA|xANY|xBLANK|xCAP|xCAPLET|xCTRL|xEMOJI|xEND|xEOF|xLET|xNIL|xNUM|xPUNCT|xSTART|xVAR|xWHITE|xWILD)\b/,
				'node': {
					pattern: /\b_[a-z]\w*/i,
					alias: 'class-name',
				},
				'char': /\\./,
				'number': /\b\d+\b/,
				'operator': /=/,
				'punctuation': /[[\]()]/,
			},
		},
		// A literal character in a rule is backslash-escaped: \. \, \-
		'char': /\\./,
		// Special node names that match classes of text: _xWILD, _xALPHA ...
		'constant':
			/\b_(?:ROOT|xALPHA|xANY|xBLANK|xCAP|xCAPLET|xCTRL|xEMOJI|xEND|xEOF|xLET|xNIL|xNUM|xPUNCT|xSTART|xVAR|xWHITE|xWILD)\b/,
		// Every other leading-underscore name is a parse-tree node: _noun, _money.
		'node': {
			pattern: /\b_[a-z]\w*/i,
			alias: 'class-name',
		},
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
		'operator': /<<|&&|\|\||\+\+|--|[!=<>]=?|[-+*/%]/,
		'punctuation': /[{}[\]();,]/,
	},
};
