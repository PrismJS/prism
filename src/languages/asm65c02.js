import asm6502 from './asm6502.js';

/** @type {import('../types.d.ts').LanguageProto<'asm65c02'>} */
export default {
	id: 'asm65c02',
	base: asm6502,
	grammar ({ base }) {
		return {
			'op-code': [
				/** @type {import('../types.d.ts').GrammarToken} */ (base['op-code']),
				{
					pattern:
						/\b(?:BBR[0-7]|BBS[0-7]|BRA|PHX|PHY|PLX|PLY|RMB[0-7]|SMB[0-7]|STZ|TRB|TSB|bbr[0-7]|bbs[0-7]|bra|phx|phy|plx|ply|rmb[0-7]|smb[0-7]|stz|trb|tsb)\b/,
					alias: 'keyword',
				},
				{
					pattern:
						/\b(?:STP|WAI|stp|wai)\b/,
					alias: 'keyword',
				},
			],
		};
	},
};
