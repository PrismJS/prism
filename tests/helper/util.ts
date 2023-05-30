import * as Prettier from 'prettier';
import { RegExpParser } from 'regexpp';
import { Flags, Pattern } from 'regexpp/ast';

export interface LiteralAST {
	pattern: Pattern;
	flags: Flags;
}


const parser = new RegExpParser();
const astCache = new Map<string, LiteralAST>();

export interface PathItem {
	key: string | null;
	value: any;
}
/**
 * Performs a breadth-first search on the given start element.
 */
export function BFS(start: any, callback: (path: PathItem[], obj: Record<string, any>) => void) {
	const visited = new Set();
	let toVisit: PathItem[][] = [
		[{ key: null, value: start }]
	];

	while (toVisit.length > 0) {
		const newToVisit: PathItem[][] = [];

		for (const path of toVisit) {
			const obj = path[path.length - 1].value;
			if (!visited.has(obj)) {
				visited.add(obj);

				for (const key in obj) {
					const value = obj[key];

					path.push({ key, value });
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
export function BFSPathToPrismTokenPath(path: readonly PathItem[], root: string = 'Prism.languages'): string {
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
