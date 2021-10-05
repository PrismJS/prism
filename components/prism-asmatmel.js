Prism.languages.asmatmel = {
	'comment': /;.*/,
	'constant': {
		pattern: /\b(?:P[A-Z][0-9])\b|\b(?:P[A-Z]3[0-1])\b|\b(?:P[A-Z][0-2][0-9])\b|PORT[A-Z]|DDR[A-Z]|\b(?:DD[A-Z][0-9])\b|\b(?:DD[A-Z]3[0-1])\b|\b(?:DD[A-Z][0-2][0-9])\b/
	},
	'directive': {
		pattern: /\.\w+(?= )/,
		alias: 'property'
	},
	'rregister': {
		pattern: /\b(?:r3[0-1])\b|\b(?:r[1-2][0-9])\b|\b(?:r[0-9])\b/,
		alias: 'variable'
	},
	'string': /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/,
	'opcode': {
		pattern: /\b(?:adc|add|adiw|and|andi|asr|bclr|bld|brbc|brbs|brcc|brcs|break|breq|brge|brhc|brhs|brid|brie|brlo|brlt|brmi|brne|brpl|brsh|brtc|brts|brvc|brvs|bset|bst|call|cbi|cbr|clc|clh|cli|cln|clr|cls|clt|clv|clz|com|cp|cpc|cpi|cpse|dec|des|eicall|eijmp|elpm|eor|fmul|fmuls|fmulsu|icall|ijmp|in|inc|jmp|lac|las|lat|ld|ld[^abcdefghijklmnopqrstuvwxA-Z]|ldi|lds|lpm|lsl|lsr|mov|movw|mul|muls|mulsu|neg|nop|or|ori|out|pop|push|rcall|ret|reti|rjmp|rol|ror|sbc|sbci|sbi|sbic|sbis|sbiw|sbr|sbrc|sbrs|sec|seh|sei|sen|ser|ses|set|sev|sez|sleep|spm|st|st[^abcdefghijklmnopqrstuvwx]|sts|sub|subi|swap|tst|wdr|xch|ADC|ADD|ADIW|AND|ANDI|ASR|BCLR|BLD|BRBC|BRBS|BRCC|BRCS|BREAK|BREQ|BRGE|BRHC|BRHS|BRID|BRIE|BRLO|BRLT|BRMI|BRNE|BRPL|BRSH|BRTC|BRTS|BRVC|BRVS|BSET|BST|CALL|CBI|CBR|CLC|CLH|CLI|CLN|CLR|CLS|CLT|CLV|CLZ|COM|CP|CPC|CPI|CPSE|DEC|DES|EICALL|EIJMP|ELPM|EOR|FMUL|FMULS|FMULSU|ICALL|IJMP|IN|INC|JMP|LAC|LAS|LAT|LD|LD[^ABCDEFGHIJKLMNOPQRSTUVW]|LDI|LDS|LPM|LSL|LSR|MOV|MOVW|MUL|MULS|MULSU|NEG|NOP|OR|ORI|OUT|POP|PUSH|RCALL|RET|RETI|RJMP|ROL|ROR|SBC|SBCI|SBI|SBIC|SBIS|SBIW|SBR|SBRC|SBRS|SEC|SEH|SEI|SEN|SER|SES|SET|SEV|SEZ|SLEEP|SPM|ST|ST[^ABCDEFGHIJKLMNOPQRSTUVWXa-z]|STS|SUB|SUBI|SWAP|TST|WDR|XCH)\b/,
		alias: 'keyword'
	},
	'hexnumber': {
		pattern: /#?\$[\da-f]{2,4}\b/i,
		alias: 'string'
	},
	'binarynumber': {
		pattern: /#?%[01]+\b/,
		alias: 'string'
	},
	'decimalnumber': {
		pattern: /#?\b\d+\b/,
		alias: 'string'
	},
	'register': {
		pattern: /\b[acznvshtixy]\b/i,
		alias: 'variable'
	},
	'operator': />>=?|<<=?|&&?|\|\|?|[-+*/%&|^!=<>?]=?/,
	'punctuation': /[(),:]/
};
