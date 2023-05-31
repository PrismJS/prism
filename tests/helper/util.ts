import * as Prettier from 'prettier';
import { RegExpParser } from 'regexpp';
import type { Flags, Pattern } from 'regexpp/ast';

export interface LiteralAST {
	pattern: Pattern;
	flags: Flags;
}


const parser = new RegExpParser();
const astCache = new Map<string, LiteralAST>();

export interface PathItem {
	key: string | null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any;
}
/**
 * Performs a breadth-first search on the given start element.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BFS(start: any, callback: (path: PathItem[], obj: Record<string, any>) => void) {
	const visited = new Set();
	let toVisit: PathItem[][] = [
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		[{ key: null, value: start }]
	];

	while (toVisit.length > 0) {
		const newToVisit: PathItem[][] = [];

		for (const path of toVisit) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const obj = path[path.length - 1].value;
			if (!visited.has(obj)) {
				visited.add(obj);

				for (const key in obj) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
					const value = obj[key];

					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					path.push({ key, value });
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					callback(path, obj);

					if (Array.isArray(value) || Object.prototype.toString.call(value) === '[object Object]') {
						newToVisit.push([...path]);
					}

					path.pop();
				}
			}
		}

		toVisit = newToVisit;
	}
}

/**
 * Given the `BFS` path given to `BFS` callbacks, this will return the Prism language token path of the current
 * value (e.g. `Prism.languages.xml.tag.pattern`).
 */
export function BFSPathToPrismTokenPath(path: readonly PathItem[], root = 'Prism.languages'): string {
	let tokenPath = root;
	for (const { key } of path) {
		if (!key) {
			// do nothing
		} else if (/^\d+$/.test(key)) {
			tokenPath += `[${key}]`;
		} else if (/^[a-z]\w*$/i.test(key)) {
			tokenPath += `.${key}`;
		} else {
			tokenPath += `[${JSON.stringify(key)}]`;
		}
	}
	return tokenPath;
}

/**
 * Returns the AST of a given pattern.
 */
export function parseRegex(regex: RegExp): LiteralAST {
	const key = regex.toString();
	let literal = astCache.get(key);
	if (literal === undefined) {
		const flags = parser.parseFlags(regex.flags, undefined);
		const pattern = parser.parsePattern(regex.source, undefined, undefined, flags.unicode);
		literal = { pattern, flags };
		astCache.set(key, literal);
	}
	return literal;
}

export function getLeadingSpaces(string: string) {
	return /^\s*/.exec(string)?.[0] ?? '';
}
export function getTrailingSpaces(string: string): string {
	return /\s*$/.exec(string)?.[0] ?? '';
}

export function formatHtml(html: string): string {
	return Prettier.format(html, {
		printWidth: 100,
		tabWidth: 4,
		useTabs: true,
		htmlWhitespaceSensitivity: 'ignore',
		filepath: 'fake.html',
	});
}

export function isRegExp(value: unknown): value is RegExp {
	return Object.prototype.toString.call(value) === '[object RegExp]';
}
