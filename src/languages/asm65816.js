/** @type {import('../types.d.ts').LanguageProto<'asm65816'>} */
export default {
	id: 'asm65816',
	grammar: {
		'comment': /;.*/,
		'directive': {
			pattern: /\.\w+(?= )/,
			alias: 'property',
		},
		'string': /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/,
		'op-code': {
			pattern:
				/\b(?:ADC|AND|ASL|BCC|BCS|BEQ|BIT|BMI|BNE|BPL|BRA|BRK|BRL|BVC|BVS|CLC|CLD|CLI|CLV|CMP|COP|CPX|CPY|DEC|DEX|DEY|EOR|INC|INX|INY|JML|JMP|JSL|JSR|LDA|LDX|LDY|LSR|MVN|MVP|NOP|ORA|PEA|PEI|PER|PHA|PHB|PHD|PHK|PHP|PHX|PHY|PLA|PLB|PLD|PLP|PLX|PLY|REP|ROL|ROR|RTI|RTL|RTS|SBC|SEC|SED|SEI|SEP|STA|STP|STX|STY|STZ|TAX|TAY|TCD|TCS|TDC|TRB|TSB|TSC|TSX|TXA|TXS|TXY|TYA|TYX|WAI|WDM|XBA|XCE|adc|and|asl|bcc|bcs|beq|bit|bmi|bne|bpl|bra|brk|brl|bvc|bvs|clc|cld|cli|clv|cmp|cop|cpx|cpy|dec|dex|dey|eor|inc|inx|iny|jml|jmp|jsl|jsr|lda|ldx|ldy|lsr|mvn|mvp|nop|ora|pea|pei|per|pha|phb|phd|phk|php|phx|phy|pla|plb|pld|plp|plx|ply|rep|rol|ror|rti|rtl|rts|sbc|sec|sed|sei|sep|sta|stp|stx|sty|stz|tax|tay|tcd|tcs|tdc|trb|tsb|tsc|tsx|txa|txs|txy|tya|tyx|wai|wdm|xba|xce)\b/,
			alias: 'keyword',
		},
		'hex-number': {
			pattern: /#?\$[\da-f]{1,6}\b/i,
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
		'punctuation': /[\[\](),:]/,
	},
};
