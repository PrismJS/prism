Prism.languages.cil = {
	'comment': /\/\/.*/,
	
	'string': {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	
	'class-name': {
		pattern: /([^a-zA-Z0-9])\.[a-z]+\b/,
		lookbehind: true
	},
	
	// Actually an assembly reference
	'variable': /\[\w+\]/,
	
	'boolean': /\b(?:true|false)\b/,
	'number': /\b-?(0x)?[0-9a-fA-F]+(?:\.[0-9a-fA-F]+)?\b/i,
	
	'keyword': /\b(abstract|ansi|assembly|auto|autochar|beforefieldinit|bool|bstr|byvalstr|cil|class|currency|date|decimal|default|enum|error|explicit|extends|extern|famandassem|family|famorassem|final|float32|float64|hidebysig|iant|idispatch|import|initonly|instance|int|int16|int32|int64|int8|interface|iunknown|lpstr|lpstruct|lptstr|lpwstr|managed|nativeType|nested|newslot|objectref|pinvokeimpl|private|privatescope|public|reqsecobj|rtspecialname|sealed|sequential|serializable|specialname|static|string|struct|syschar|tbstr|unicode|unmanagedexp|unsigned|value|variant|virtual|void)\b/,
	
	'function': /\b(conv\.(?:[iu][1248]?|ovf\.[iu][1248]?(?:\.un)?|r\.un|r4|r8)|ldc\.(i4(\.[0-9]+|\.[mM]1|\.s)?|i8|r4|r8)|ldelem(\.[iu][1248]|\.r[48]|\.ref|a)?|ldind\.([iu][1248]?|r[48]|ref)|stelem(\.i[1248]?|r[48]|ref)?|stind(\.i[1248]?|r[48]|ref)?|end(fault|filter|finally)|ldarg(\.[0-3s]|a(\.s)?)?|ldloc(\.[0-9]+|\.s)?|sub(\.ovf(\.un)?)?|mul(\.ovf(\.un)?)?|add(\.ovf(\.un)?)?|stloc(\.[0-3s])?|refany(type|val)|blt(\.un)?(\.s)?|ble(\.un)?(\.s)?|bgt(\.un)?(\.s)?|bge(\.un)?(\.s)?|unbox(\.any)?|init(blk|obj)|call(i|virt)?|brfalse(\.s)?|bne\.un(\.s)?|ldloca(\.s)?|brzero(\.s)?|brtrue(\.s)?|brnull(\.s)?|brinst(\.s)?|starg(\.s)?|leave(\.s)?|constrained|shr(\.un)?|rem(\.un)?|div(\.un)?|clt(\.un)?|alignment|unaligned|ldvirtftn|castclass|beq(\.s)?|volatile|readonly|mkrefany|localloc|ckfinite|rethrow|ldtoken|ldsflda|cgt\.un|arglist|switch|stsfld|sizeof|newobj|newarr|ldsfld|ldnull|ldflda|isinst|throw|stobj|stloc|stfld|ldstr|ldobj|ldlen|ldftn|ldfld|cpobj|cpblk|break|br\.s|tail|xor|shl|ret|pop|not|nop|neg|jmp|dup|clt|cgt|ceq|box|and|or|br)\b/,
	
	'punctuation': /[{}[\];(),:.=]|IL_[0-9A-Za-z]+/
}
