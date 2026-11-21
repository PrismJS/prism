import asm6502 from './asm6502.js';

/** @type {import('../types.d.ts').LanguageProto<'asm65816'>} */
export default {
	id: 'asm65816',
	base: asm6502,
	grammar ({ base }) {
		return {
			'op-code': [
				/** @type {import('../types.d.ts').GrammarToken} */ (base['op-code']),
				{
					pattern:
						/\b(?:BRA|BRL|COP|JML|JSL|MVN|MVP|PEA|PEI|PER|PHB|PHD|PHK|PHX|PHY|PLB|PLD|PLX|PLY|REP|RTL|SEP|STP|STZ|TCD|TCS|TDC|TRB|TSB|TSC|TXY|TYX|WAI|WDM|XBA|XCE|bra|brl|cop|jml|jsl|mvn|mvp|pea|pei|per|phb|phd|phk|phx|phy|plb|pld|plx|ply|rep|rtl|sep|stp|stz|tcd|tcs|tdc|trb|tsb|tsc|txy|tyx|wai|wdm|xba|xce)\b/,
					alias: 'keyword',
				},
			],
			'hex-number': {
				pattern: /#?\$[\da-f]{1,6}\b/i,
				alias: 'number',
			},
			'register': {
				pattern: /\b(?:[xya]|sp?)\b/i,
				alias: 'variable',
			},
			'punctuation': /[\[\](),:]/,
		};
	},
};
