Prism.languages.fift = {
	'symbol': [
		/[xX]\{[0-9a-fA-F_]*\}/,
		/[bB]\{[01]*\}/,
		/'\S+/,
	],
	
	'keyword': /\b(?:-roll|-rot|-trailing|-trailing0|2constant|2drop|2dup|2over|2swap|abort|abs|allot|and|anon|atom|bbitrefs|bbits|bl|box|brefs|brembitrefs|brembits|bremrefs|bye|caddr|cadr|car|cddr|cdr|char|chr|cmp|cond|cons|constant|count|cr|create|depth|dictmap|dictmerge|dictnew|does|drop|dup|ed25519_chksign|ed25519_sign|ed25519_sign_uint|emit|exch|exch2|execute|explode|find|first|fits|forget|gasrunvm|gasrunvmcode|gasrunvmctx|gasrunvmdict|halt|hash|hashB|hashu|hold|hole|if|ifnot|include|list|max|min|minmax|mod|negate|newkeypair|nil|nip|nop|not|now|null|or|over|pair|pick|quit|remaining|reverse|roll|rot|runvm|runvmcode|runvmctx|runvmdict|sbitrefs|sbits|second|sgn|shash|sign|single|skipspc|space|srefs|swap|ten|third|times|triple|tuck|tuple|type|ufits|uncons|unpair|unsingle|until|untriple|untuple|variable|while|word|words|xor)\b/,
	'boolean': /\b(?:false|true)\b/,

	'comment': [
		{
			pattern: /\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true,
			greedy: true,
		},
		{
			pattern: /\/\/.*/,
			lookbehind: true,
			greedy: true,
		},
	],

	'operator': [
		// Full list can be found in
		// Appendix A. List of Fift words
		// Ordered the same way source code does this.
		// Except: shorter words must follow
		// longer ones with the same base part.
		// Example: `#` comes after `#s`
		/#>/, /#s/, /\$#/, /#/,

		/\$\+/, /\$,/, /\$\d/, /\$=/, /\$(?=\()/,
		/\$>smca/, /\$>s/,
		/\$@\+/, /\$@\?\+/, /\$@\?/, /\$@/,
		/\$cmp/, /\$len/, /\$pos/, /\$reverse/,

		/%1<</,

		/\('\)/, /\(-trailing\)/, /\(\.\)/, /\(atom\)/, /\(b\.\)/,
		/\(compile\)/, /\(create\)/, /\(def\?\)/, /\(dump\)/, /\(execute\)/,
		/\(forget\)/, /\(number\)/, /\(x\.\)/, /\(\{\)/, /\(\}\)/,

		/\*\/cmod/, /\*\/c/, /\*\/mod/, /\*\/rmod/, /\*\/r/, /\*\//,
		/\*>>c/, /\*>>r/, /\*>>/, /\*mod/, /\*/,

		/\+!/, /\+/, /,/, /-!/, /-/, /!/,
		/-1<</, /\._/, /\.dump/, /\.l/, /\.sl/, /\.s/, /\.tc/,
		/\//, /\/\*/, /\/cmod/, /\/c/, /\/mod/, /\/rmod/, /\/r/,
		/0!/, /0<=/, /0<>/, /0</, /0=/, /0>=/, /0>/,
		/1\+!/, /1\+/, /1-!/, /1-/, /1<</, /1<<1-/,
		/2\*/, /2\+/, /2-/, /2\//, /2=:/,

		/::_/, /::/, /:_/, /=:/, /:/,

		/<#/, /<<\/c/, /<<\/r/, /<=/, /<>/, /<b/, /<s/, /<<\//,
		/<</, /</, /=/,

		/>=/, />>c/, />>r/, />>/, />/,

		/\?dup/,

		/@'/, /@/,

		/B\+/, /B,/, /B=/, /B>Li@\+/, /B>Li@/, /B>Lu@\+/, /B>Lu@/, /B>boc/,
		/B>file/, /B>i@\+/, /B>i@/, /B>u@\+/, /B>u@/,
		/B@\?\+/, /B@\+/, /B@\?/, /B@/,
		/Bcmp/, /BhashB/, /Bhashu/, /Bhash/, /Blen/, /Bx\./,
		/B\|/, /Li>B/, /Lu>B/,

		/\[\]/, /\[compile\]/, /\[/, /\]/,

		/atom\?/,

		/b\+/, /b\._/, /b\./,
		/b>idict!\+/, /b>idict!/, /b>sdict!\+/, /b>sdict!/,
		/b>udict!\+/, /b>udict!/,
		/b>/, /boc\+>B/, /boc>B/,

		/csr\./,
		/def\?/,
		/empty\?/, /eq\?/,
		/file-exists\?/, /file>B/,

		/i,/, /i>B/, /i@\+/, /i@/, /i@\?\+/, /i@\?/,
		/idict!\+/, /idict!/, /idict-/, /idict@-/, /idict@/,

		/null!/, /null\?/,
		/pfxdict!\+/, /pfxdict!/, /pfxdict@/, /priv>pub/,
		/ref@\+/, /ref@/, /ref@\?\+/, /ref@\?/,

		/s,/, /s>c/, /s>/,
		/sdict!\+/, /sdict!/, /sdict-/, /sdict@-/, /sdict@/,
		/smca>\$/, /sr,/,

		/tuple\?/,

		/u,/, /u>B/, /u@\+/, /u@\?\+/, /u@\?/,
		/udict!\+/, /udict!/, /udict-/, /udict@-/, /udict@/,
		/undef\?/,

		/x\._/, /x\./,

		/\|\+/, /\|/, /\|_/,

		// Should be the last:
		/\./,
	],

	'number': [
		/(0[xX][0-9a-fA-F]+)/,
		/(0[bB][01]+)/,
		/(-?\d+(\/-?\d+)?)/,
	],
	'string': /"([^"\r\n\\]|\\.)*"/,
	'variable': /[\w$-]+/,

	'punctuation': /[\[\{\}\],]/,
};
