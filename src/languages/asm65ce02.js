import asm6502 from './asm6502.js';

/** @type {import('../types.d.ts').LanguageProto<'asm65ce02'>} */
export default {
	id: 'asm65ce02',
	base: asm6502,
	grammar ({ base }) {
		return {
			'op-code': [
				/** @type {import('../types.d.ts').GrammarToken} */ (base['op-code']),
				{
					pattern:
						/\b(?:ASR|ASW|AUG|BBR[0-7]|BBS[0-7]|BRA|BSR|CLE|CPZ|DEW|DEZ|INW|INZ|LBCC|LBCS|LBEQ|LBIT|LBMI|LBNE|LBPL|LBRA|LBVC|LBVS|LDZ|NEG|PHW|PHX|PHY|PHZ|PLX|PLY|PLZ|RMB[0-7]|ROW|RTN|SEE|SMB[0-7]|STP|STZ|TAB|TAZ|TBA|TRB|TSB|TSY|TYS|TZA|WAI|asr|asw|aug|bbr[0-7]|bbs[0-7]|bra|bsr|cle|cpz|dew|dez|inw|inz|lbcc|lbcs|lbeq|lbit|lbmi|lbne|lbpl|lbra|lbvc|lbvs|ldz|neg|phw|phx|phy|phz|plx|ply|plz|rmb[0-7]|row|rtn|see|smb[0-7]|stp|stz|tab|taz|tba|trb|tsb|tsy|tys|tza|wai)\b/,
					alias: 'keyword',
				},
			],
			'register': {
				pattern: /\b(?:[xyza]|sp?)\b/i,
				alias: 'variable',
			},
		};
	},
};
