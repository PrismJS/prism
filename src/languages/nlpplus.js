/**
 * NLP++, the programming language for natural language processing
 * (https://visualtext.org/nlp/). An analyzer is a sequence of passes; each
 * pass matches pattern rules against a parse tree and runs code when a rule
 * fires.
 *
 * Built-in functions are highlighted only when called, because the same words
 * (next, single, str, ...) also appear as literal text in rules.
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
		'region': {
			pattern:
				/@@?(?:CHECK|CODE|DECL|GROUP|MULTI|NODES|PATH|POST|PRE|RECURSE|RULES|SELECT)\b|@@/,
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
			/\b(?:abs|addarg|addattr|addcnode|addconcept|addconval|addnode|addnumval|addstmt|addstrs|addstrval|addsval|addword|arraylength|attrchange|attrexists|attrname|attrtype|attrvals|attrwithval|batchstart|cap|cbuf|ceiling|closefile|conceptname|conceptpath|conval|cout|coutreset|dballocstmt|dbbindcol|dbclose|dbexec|dbexecstmt|dbfetch|dbfreestmt|dbopen|deaccent|debug|dictfindword|dictfirst|dictgetword|dictnext|down|eltnode|excise|exitpass|exittopopup|factorial|fail|fileout|findana|findattr|findattrs|findconcept|findhierconcept|findnode|findphrase|findroot|findvals|findwordpath|firstnode|floor|flt|fltval|fncallstart|fprintgvar|fprintnvar|fprintvar|fprintxvar|gdump|getconcept|getconval|getnumval|getpopupdata|getstrval|getsval|ginc|gp|group|gtolower|guniq|hitconf|inc|inheritval|inputrange|inputrangetofile|interactive|kbdumptree|lasteltnode|lastnode|length|lengthr|levenshtein|lextagger|listadd|listnode|lj|log|logten|lookup|lowercase|makeconcept|makeparentconcept|makephrase|makestmt|merge|merger|mkdir|mod|movecleft|movecright|movesem|ndump|next|nextattr|nextval|ninc|nodeconcept|nodeowner|noop|num|numrange|numval|openfile|or|pathconcept|percentstr|permuten|phraselength|phraseraw|phrasetext|pncopyvars|pndeletechilds|pndown|pninsert|pnmakevar|pnname|pnnext|pnprev|pnrename|pnreplaceval|pnroot|pnsingletdown|pnup|pnvar|pnvarnames|pow|pranchor|prchild|preaction|prev|print|printr|printvar|prlit|prrange|prtree|prunephrases|prxtree|randomint|regexp|regexpi|renameattr|renamechild|renameconcept|renamenode|replaceval|resolveurl|returnstmt|rfaaction|rfaactions|rfaarg|rfaargtolist|rfacode|rfaelement|rfaelt|rfaexpr|rfalist|rfalitelt|rfalittoaction|rfalittopair|rfaname|rfanodes|rfanonlit|rfanonlitelt|rfanum|rfaop|rfapair|rfapairs|rfapostunary|rfapres|rfarange|rfarecurse|rfarecurses|rfaregion|rfaregions|rfarule|rfarulelts|rfarulemark|rfarules|rfarulesfile|rfaselect|rfastr|rfasugg|rfaunary|rfavar|rfbarg|rfbdecl|rfbdecls|rightjustifynum|rmattr|rmattrs|rmattrval|rmchild|rmchildren|rmconcept|rmcphrase|rmnode|rmphrase|rmval|rmvals|rmword|round|sdump|setbase|setlookahead|setunsealed|single|singler|singlex|singlezap|sortchilds|sortconsbyattr|sorthier|sortphrase|sortvals|spellcandidates|spellcorrect|spellword|splice|split|sqlstr|sqrt|startout|stem|stopout|str|strchar|strchr|strchrcount|strclean|strcontains|strcontainsnocase|strendswith|strequal|strequalnocase|strescape|strgreaterthan|strisalpha|strisdigit|strislower|strisupper|strlength|strlessthan|strnotequal|strnotequalnocase|strpiece|strrchr|strspellcandidate|strspellcompare|strstartswith|strsubst|strtolower|strtotitle|strtoupper|strtrim|strunescape|strval|strwrap|succeed|suffix|system|take|today|topdir|truncate|unknown|unpackdirs|up|uppercase|urlbase|urltofile|var|vareq|varfn|varfnarray|varinlist|varne|varstrs|varz|whilestmt|wnhypnymstoconcept|wninit|wnsensestoconcept|wordindex|wordpath|writekb|xaddlen|xaddnvar|xdump|xinc|xmlstr|xrename)\b(?=\s*\()/i,
		'keyword': /\b(?:else|if|return|while)\b/i,
		'function': /\b[a-z]\w*(?=\s*\()/i,
		'number': /\b\d+(?:\.\d+)?\b/,
		'operator': /<<|&&|\|\||\+\+|--|[!=<>]=?|[-+*/%]/,
		'punctuation': /[{}[\]();,]/,
	},
};
