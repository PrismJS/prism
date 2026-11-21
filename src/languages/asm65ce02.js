import asm65c02 from './asm65c02.js';

/** @type {import('../types.d.ts').LanguageProto<'asm65ce02'>} */
export default {
	id: 'asm65ce02',
	base: asm65c02,
	grammar ({ base }) {
		const [op6502, op65c02] = /** @type {import('../types.d.ts').GrammarToken[]} */ (
			base['op-code']
		);

		return {
			'op-code': [
				op6502,
				op65c02,
				{
					pattern: /\b(?:ASR|ASW|AUG|BSR|CLE|CPZ|DEW|DEZ|INW|INZ|LBCC|LBCS|LBEQ|LBMI|LBNE|LBPL|LBRA|LBVC|LBVS|LDZ|NEG|PHW|PHZ|PLZ|ROW|RTN|SEE|TAB|TAZ|TBA|TSY|TYS|TZA|asr|asw|aug|bsr|cle|cpz|dew|dez|inw|inz|lbcc|lbcs|lbeq|lbmi|lbne|lbpl|lbra|lbvc|lbvs|ldz|neg|phw|phz|plz|row|rtn|see|tab|taz|tba|tsy|tys|tza)\b/,
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
