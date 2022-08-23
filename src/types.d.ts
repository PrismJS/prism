export interface LanguageProto {
	id: string;
	require?: LanguageProto | readonly LanguageProto[];
	optional?: string | readonly string[];
	alias?: string | readonly string[];
	grammar: Grammar | ((arg0: { getLanguage: (id: string) => Grammar, extend: (id: string, ref: Grammar) => Grammar }) => Grammar)
}

export interface GrammarToken {
	pattern: RegExp
	lookbehind?: boolean
	greedy?: boolean
	alias?: string | string[]
	inside?: string | Grammar
}

export type Grammar = Record<string, RegExp | GrammarToken | (RegExp | GrammarToken)[]>
