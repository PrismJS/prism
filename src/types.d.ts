export interface LanguageProto {
	id: string;
	require?: LanguageProto | readonly LanguageProto[];
	optional?: string | readonly string[];
	alias?: string | readonly string[];
	grammar: Grammar | ((arg0: { getLanguage: (id: string) => Grammar, extend: (id: string, ref: Grammar) => Grammar }) => Grammar)
}
