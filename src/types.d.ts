import { rest } from "./shared/symbols";

export interface LanguageProto {
	id: string;
	require?: LanguageProto | readonly LanguageProto[];
	optional?: string | readonly string[];
	alias?: string | readonly string[];
	grammar: Grammar | ((arg0: { getLanguage: (id: string) => Grammar, extend: (id: string, ref: GrammarTokens) => Grammar }) => Grammar)
}

export interface GrammarToken {
	pattern: RegExp
	lookbehind?: boolean
	greedy?: boolean
	alias?: string | string[]
	inside?: string | Grammar
}

export type GrammarTokens = Partial<Record<string, RegExp | GrammarToken | (RegExp | GrammarToken)[]>>;

export type Grammar = GrammarTokens & { [rest]?: Grammar | string | null };

export interface PlainObject {
	[key: string]: unknown;
}
