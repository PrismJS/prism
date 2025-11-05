/** @type {import('../types.d.ts').LanguageProto<'asm65c02'>} */
export default {
	id: 'asm65c02',
	grammar: {
		'comment': /;.*/,
		'directive': {
			pattern: /\.\w+(?= )/,
			alias: 'property',
		},
		'string': /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/,
		'op-code': {
			pattern:
				/\b(?:ADC|AND|ASL|BBR0|BBR1|BBR2|BBR3|BBR4|BBR5|BBR6|BBR7|BBS0|BBS1|BBS2|BBS3|BBS4|BBS5|BBS6|BBS7|BCC|BCS|BEQ|BIT|BMI|BNE|BPL|BRA|BRK|BVC|BVS|CLC|CLD|CLI|CLV|CMP|CPX|CPY|DEC|DEX|DEY|EOR|INC|INX|INY|JMP|JSR|LDA|LDX|LDY|LSR|NOP|ORA|PHA|PHP|PHX|PHY|PLA|PLP|PLX|PLY|RMB0|RMB1|RMB2|RMB3|RMB4|RMB5|RMB6|RMB7|ROL|ROR|RTI|RTS|SBC|SEC|SED|SEI|SMB0|SMB1|SMB2|SMB3|SMB4|SMB5|SMB6|SMB7|STA|STP|STX|STY|STZ|TAX|TAY|TRB|TSB|TSX|TXA|TXS|TYA|WAI|adc|and|asl|bbr0|bbr1|bbr2|bbr3|bbr4|bbr5|bbr6|bbr7|bbs0|bbs1|bbs2|bbs3|bbs4|bbs5|bbs6|bbs7|bcc|bcs|beq|bit|bmi|bne|bpl|bra|brk|bvc|bvs|clc|cld|cli|clv|cmp|cpx|cpy|dec|dex|dey|eor|inc|inx|iny|jmp|jsr|lda|ldx|ldy|lsr|nop|ora|pha|php|phx|phy|pla|plp|plx|ply|rmb0|rmb1|rmb2|rmb3|rmb4|rmb5|rmb6|rmb7|rol|ror|rti|rts|sbc|sec|sed|sei|smb0|smb1|smb2|smb3|smb4|smb5|smb6|smb7|sta|stp|stx|sty|stz|tax|tay|trb|tsb|tsx|txa|txs|tya|wai)\b/,
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
			pattern: /\b[xya]\b/i,
			alias: 'variable',
		},
		'punctuation': /[(),:]/,
	},
};
