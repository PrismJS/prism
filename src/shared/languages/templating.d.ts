import type { Token } from '../../core.js';
import type { Grammar } from '../../types.d.ts';

type TokenStack = [number, Token][];

type GrammarRef = Grammar | string | undefined | null;

type EmbeddedInReturnFn = NonNullable<Grammar['$tokenize']>;
