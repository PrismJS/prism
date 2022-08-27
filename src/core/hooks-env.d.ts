import { Grammar } from '../types';
import { TokenStream } from './token';

/**
 * An interface containing all hooks Prism runs.
 */
export interface HookEnvMap {
	// Prism.highlightAll
	'before-highlightall': BeforeHighlightAllEnv;
	'before-all-elements-highlight': BeforeAllElementsHighlightEnv;

	// Prism.highlightElement
	'before-sanity-check': BeforeSanityCheckEnv;
	'before-highlight': BeforeHighlightEnv;

	'before-insert': BeforeInsertEnv;
	'after-highlight': AfterHighlightEnv;
	'complete': CompleteEnv;

	// Prism.highlight
	'before-tokenize': BeforeTokenizeEnv;
	'after-tokenize': AfterTokenizeEnv;

	// stringify
	'wrap': WrapEnv;
}

export type HookEnv<HookName extends string> = HookName extends keyof HookEnvMap ? HookEnvMap[HookName] : unknown;

export type HookCallback<HookName extends string> = (env: HookEnv<HookName>) => void;

export interface BeforeHighlightAllEnv {
	root: ParentNode;
	selector: string;
	callback?: (element: Element) => void;
}
export interface BeforeAllElementsHighlightEnv {
	root: ParentNode;
	selector: string;
	callback?: (element: Element) => void;
	elements: Element[];
}

export interface BeforeSanityCheckEnv {
	element: Element;
	language: string;
	grammar: Grammar | undefined;
	code: string;
}
export interface BeforeHighlightEnv {
	element: Element;
	language: string;
	grammar: Grammar | undefined;
	code: string;
}
export interface CompleteEnv {
	element: Element;
	language: string;
	grammar: Grammar | undefined;
	code: string;
}
export interface BeforeInsertEnv {
	element: Element;
	language: string;
	grammar: Grammar | undefined;
	code: string;
	highlightedCode: string;
}
export interface AfterHighlightEnv {
	element: Element;
	language: string;
	grammar: Grammar | undefined;
	code: string;
	highlightedCode: string;
}

export interface BeforeTokenizeEnv {
	code: string;
	language: string;
	grammar: Grammar | undefined;
}
export interface AfterTokenizeEnv {
	code: string;
	language: string;
	grammar: Grammar;
	tokens: TokenStream;
}

export interface WrapEnv {
	type: string;
	content: string;
	tag: string;
	classes: string[];
	attributes: Record<string, string>;
	language: string;
}
