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
	'number': /\b(0x)?[0-9a-fA-F]+\b/i,
	'punctuation': /[{}[\];(),:]|IL_[0-9A-Za-z]+/,
	
	'keyword': /\b(iant|currency|syschar|void|bool|int8|int16|int32|int64|float32|float64|error|unsigned int8|unsigned int16|unsigned int32|unsigned int64|nativeType|decimal|date|bstr|lpstr|lpwstr|lptstr|objectref|iunknown|idispatch|struct|interface|int|unsigned int|nested struct|byvalstr|ansi bstr|tbstr|variant bool|lpstruct|static|public|private|family|final|specialname|virtual|abstract|assembly|default|cil managed|famandassem|famorassem|privatescope|hidebysig|newslot|rtspecialname|unmanagedexp|reqsecobj|pinvokeimpl|value|enum|interface|sealed|abstract|auto|sequential|explicit|ansi|unicode|autochar|import|serializable|nested public|nested private|nested family|nested assembly|nested famandassem|nested famorassem|beforefieldinit|specialname|rtspecialname|class|instance|string|extern|extends)\b/,
	
	'function': /\b(add|add\.ovf|add\.ovf\.un|and|arglist|beq|beq\.s|bge|bge\.s|bge\.un|bge\.un\.s|bgt|bgt\.s|bgt\.un|bgt\.un\.s|ble|ble\.s|ble\.un|ble\.un\.s|blt|blt\.s|blt\.un|blt\.un\.s|bne\.un|bne\.un\.s|box|br|br\.s|break|brfalse|brfalse\.s|brinst|brinst\.s|brnull|brnull\.s|brtrue|brtrue\.s|brzero|brzero\.s|call|calli|callvirt|castclass|ceq|cgt|cgt\.un|ckfinite|clt|clt\.un|constrained\.|conv\.i|conv\.i1|conv\.i2|conv\.i4|conv\.i8|conv\.ovf\.i|conv\.ovf\.i\.un|conv\.ovf\.i1|conv\.ovf\.i1\.un|conv\.ovf\.i2|conv\.ovf\.i2\.un|conv\.ovf\.i4|conv\.ovf\.i4\.un|conv\.ovf\.i8|conv\.ovf\.i8\.un|conv\.ovf\.u|conv\.ovf\.u\.un|conv\.ovf\.u1|conv\.ovf\.u1\.un|conv\.ovf\.u2|conv\.ovf\.u2\.un|conv\.ovf\.u4|conv\.ovf\.u4\.un|conv\.ovf\.u8|conv\.ovf\.u8\.un|conv\.r\.un|conv\.r4|conv\.r8|conv\.u|conv\.u1|conv\.u2|conv\.u4|conv\.u8|cpblk|cpobj|div|div\.un|dup|endfault|endfilter|endfinally|initblk|initobj|isinst|jmp|ldarg|ldarg\.0|ldarg\.1|ldarg\.2|ldarg\.3|ldarg\.s|ldarga|ldarga\.s|ldc\.i4|ldc\.i4\.[0-9]+|ldc\.i4\.m1|ldc\.i4\.M1|ldc\.i4\.s|ldc\.i8|ldc\.r4|ldc\.r8|ldelem|ldelem\.i|ldelem\.i1|ldelem\.i2|ldelem\.i4|ldelem\.i8|ldelem\.r4|ldelem\.r8|ldelem\.ref|ldelem\.u1|ldelem\.u2|ldelem\.u4|ldelem\.u8|ldelema|ldfld|ldflda|ldftn|ldind\.i|ldind\.i1|ldind\.i2|ldind\.i4|ldind\.i8|ldind\.r4|ldind\.r8|ldind\.ref|ldind\.u1|ldind\.u2|ldind\.u4|ldind\.u8|ldlen|ldloc|ldloc\.[0-9]+|ldloc\.s|ldloca|ldloca\.s|ldnull|ldobj|ldsfld|ldsflda|ldstr|ldtoken|ldvirtftn|leave|leave\.s|localloc|mkrefany|mul|mul\.ovf|mul\.ovf\.un|neg|newarr|newobj|nop|not|or|pop|readonly\.|refanytype|refanyval|rem|rem\.un|ret|rethrow|shl|shr|shr\.un|sizeof|starg|starg\.s|stelem|stelem\.i|stelem\.i1|stelem\.i2|stelem\.i4|stelem\.i8|stelem\.r4|stelem\.r8|stelem\.ref|stfld|stind\.i|stind\.i1|stind\.i2|stind\.i4|stind\.i8|stind\.r4|stind\.r8|stind\.ref|stloc|stloc\.0|stloc\.1|stloc\.2|stloc\.3|stloc\.s|stobj|stsfld|sub|sub\.ovf|sub\.ovf\.un|switch|tail\.|throw|unaligned\.|alignment|unbox|unbox\.any|volatile\.|xor)\b/
}
