export interface LanguageProto {
	id: string;
	require?: LanguageProto | readonly LanguageProto[];
	optional?: string | readonly string[];
	alias?: string | readonly string[];
	grammar: () => Grammar
}
