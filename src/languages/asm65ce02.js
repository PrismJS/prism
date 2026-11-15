/** @type {import('../types.d.ts').LanguageProto<'asm65ce02'>} */
export default {
	id: 'asm65ce02',
	grammar: {
		'comment': /;.*/,
		'directive': {
			pattern: /\.\w+(?= )/,
			alias: 'property',
		},
		'string': /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/,
		'op-code': {
			pattern:
				/\b(?:ADC|AND|ASL|ASR|ASW|AUG|BBR0|BBR1|BBR2|BBR3|BBR4|BBR5|BBR6|BBR7|BBS0|BBS1|BBS2|BBS3|BBS4|BBS5|BBS6|BBS7|BCC|BCS|BEQ|BIT|BMI|BNE|BPL|BRA|BRK|BSR|BVC|BVS|CLC|CLD|CLE|CLI|CLV|CMP|CPX|CPY|CPZ|DEC|DEW|DEX|DEY|DEZ|EOR|INC|INW|INX|INY|INZ|JMP|JSR|LBCC|LBCS|LBEQ|LBMI|LBNE|LBPL|LBRA|LBVC|LBVS|LDA|LDX|LDY|LDZ|LSR|NEG|NOP|ORA|PHA|PHP|PHW|PHX|PHY|PHZ|PLA|PLP|PLX|PLY|PLZ|RMB0|RMB1|RMB2|RMB3|RMB4|RMB5|RMB6|RMB7|ROL|ROR|ROW|RTI|RTN|RTS|SBC|SEC|SED|SEE|SEI|SMB0|SMB1|SMB2|SMB3|SMB4|SMB5|SMB6|SMB7|STA|STX|STY|STZ|TAB|TAX|TAY|TAZ|TBA|TRB|TSB|TSX|TSY|TXA|TXS|TYA|TYS|TZA|adc|and|asl|asr|asw|aug|bbr0|bbr1|bbr2|bbr3|bbr4|bbr5|bbr6|bbr7|bbs0|bbs1|bbs2|bbs3|bbs4|bbs5|bbs6|bbs7|bcc|bcs|beq|bit|bmi|bne|bpl|bra|brk|bsr|bvc|bvs|clc|cld|cle|cli|clv|cmp|cpx|cpy|cpz|dec|dew|dex|dey|dez|eor|inc|inw|inx|iny|inz|jmp|jsr|lbcc|lbcs|lbeq|lbmi|lbne|lbpl|lbra|lbvc|lbvs|lda|ldx|ldy|ldz|lsr|neg|nop|ora|pha|php|phw|phx|phy|phz|pla|plp|plx|ply|plz|rmb0|rmb1|rmb2|rmb3|rmb4|rmb5|rmb6|rmb7|rol|ror|row|rti|rtn|rts|sbc|sec|sed|see|sei|smb0|smb1|smb2|smb3|smb4|smb5|smb6|smb7|sta|stx|sty|stz|tab|tax|tay|taz|tba|trb|tsb|tsx|tsy|txa|txs|tya|tys|tza)\b/,
			alias: 'keyword',
		},
		'hex-number': {
			pattern: /#?\$[\da-f]{1,4}\b/i,
			alias: 'number',
		},
		'binary-number': {
			pattern: /#?%[01]+\b/,
			alias: 'number',
		},
		'decimal-number': {
			pattern: /#?\b\d+\b/,
			alias: 'number',
		},
		'register': {
			pattern: /\b(?:[xyza]|sp?)\b/i,
			alias: 'variable',
		},
		'punctuation': /[(),:]/,
	},
};
