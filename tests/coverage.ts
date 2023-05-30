import { assert } from 'chai';
import * as PrismLoader from './helper/prism-loader';
import { runTestCase } from './helper/test-case';
import { loadAllTests } from './helper/test-discovery';
import { BFS, BFSPathToPrismTokenPath, isRegExp } from './helper/util';

describe('Pattern test coverage', () => {
	interface PatternData {
		pattern: RegExp;
		language: string;
		from: Set<string>;
		matches: RegExpExecArray[];
	}
	const patterns = new Map<string, PatternData>();

	async function createInstance(languages: string | string[]) {
		const Prism = await PrismLoader.createInstance(languages);

		const root = Object.fromEntries([...Prism.components['entries'].keys()].map((id) => [id, Prism.components.getLanguage(id)]));

		BFS(root, (path, object) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const { key, value } = path[path.length - 1];
			const tokenPath = BFSPathToPrismTokenPath(path);

			if (key && isRegExp(value)) {
				const regex = makeGlobal(value);
				object[key] = regex;

				const patternKey = String(regex);
				let data = patterns.get(patternKey);
				if (!data) {
					data = {
						pattern: regex,
						language: path[1].key ?? '',
						from: new Set(),
						matches: []
					};
					patterns.set(patternKey, data);
				}
				data.from.add(tokenPath);
				const { matches } = data;

				regex.exec = (string) => {
					const match = RegExp.prototype.exec.call(regex, string);
					if (match) {
						matches.push(match);
					}
					return match;
				};
			}
		});

		return Prism;
	}

	describe('Register all patterns', () => {
		it('all', async function () {
			this.slow(10 * 1000);
			// This will cause ALL regexes of Prism to be registered in the patterns map.
			// (Languages that don't have any tests can't be caught otherwise.)
			await createInstance(PrismLoader.getLanguageIds());
		});
	});

	describe('Run all language tests', () => {
		// define tests for all tests in all languages in the test suite
		for (const [languageIdentifier, files] of loadAllTests()) {
			it(languageIdentifier, async function () {
				this.timeout(10 * 1000);

				for (const filePath of files) {
					try {
						await runTestCase(languageIdentifier, filePath, 'none', createInstance);
					} catch (error) {
						// we don't case about whether the test succeeds,
						// we just want to gather usage data
					}
				}
			});
		}
	});

	describe('Coverage', () => {
		for (const language of PrismLoader.getLanguageIds()) {
			describe(language, () => {
				it(`- should cover all patterns`, () => {
					const untested = getAllOf(language).filter((d) => d.matches.length === 0);
					if (untested.length === 0) {
						return;
					}

					const problems = untested.map((data) => {
						return formatProblem(data, [
							'This pattern is completely untested. Add test files that match this pattern.'
						]);
					});

					assert.fail([
						`${problems.length} pattern(s) are untested:\n`
						+ 'You can learn more about writing tests at https://prismjs.com/test-suite.html#writing-tests',
						...problems
					].join('\n\n'));
				});

				it(`- should exhaustively cover all keywords in keyword lists`, () => {
					const problems = [];

					for (const data of getAllOf(language)) {
						if (data.matches.length === 0) {
							// don't report the same pattern twice
							continue;
						}

						const keywords = getKeywordList(data.pattern);
						if (!keywords) {
							continue;
						}
						const keywordCount = keywords.size;

						data.matches.forEach(([m]) => {
							if (data.pattern.ignoreCase) {
								m = m.toUpperCase();
							}
							keywords.delete(m);
						});

						if (keywords.size > 0) {
							problems.push(formatProblem(data, [
								`Add test files to test all keywords. The following keywords (${keywords.size}/${keywordCount}) are untested:`,
								...[...keywords].map((k) => `    ${k}`)
							]));
						}
					}

					if (problems.length === 0) {
						return;
					}

					assert.fail([
						`${problems.length} keyword list(s) are not exhaustively tested:\n`
						+ 'You can learn more about writing tests at https://prismjs.com/test-suite.html#writing-tests',
						...problems
					].join('\n\n'));
				});
			});
		}
	});

	function getAllOf(language: string) {
		return [...patterns.values()].filter((d) => d.language === language);
	}

	function short(string: string, maxLength: number): string {
		if (string.length > maxLength) {
			return string.slice(0, maxLength - 1) + '…';
		} else {
			return string;
		}
	}

	/**
	 * If the given pattern string describes a keyword list, all keyword will be returned. Otherwise, `null` will be
	 * returned.
	 */
	function getKeywordList(pattern: RegExp): Set<string> | null {
		// Right now, only keyword lists of the form /\b(?:foo|bar)\b/ are supported.
		// In the future, we might want to convert these regexes to NFAs and iterate all words to cover more complex
		// keyword lists and even operator and punctuation lists.

		let source = pattern.source.replace(/^\\b|\\b$/g, '');
		if (source.startsWith('(?:') && source.endsWith(')')) {
			source = source.slice('(?:'.length, source.length - ')'.length);
		}

		if (/^\w+(?:\|\w+)*$/.test(source)) {
			if (pattern.ignoreCase) {
				source = source.toUpperCase();
			}
			return new Set(source.split(/\|/));
		} else {
			return null;
		}
	}

	function splitOccurrences(occurrences: Iterable<string>): { origin: string; otherOccurrences: string[] } {
		const all = [...occurrences];
		return {
			origin: all[0],
			otherOccurrences: all.slice(1),
		};
	}

	function formatProblem(data: PatternData, messageLines: string[]): string {
		const { origin, otherOccurrences } = splitOccurrences(data.from);

		const lines = [
			`${origin}:`,
			short(String(data.pattern), 100),
			'',
			...messageLines,
		];

		if (otherOccurrences.length) {
			lines.push(
				'',
				'Other occurrences of this pattern:',
				...otherOccurrences.map((o) => `- ${o}`)
			);
		}

		return lines.join('\n    ');
	}
});

function makeGlobal(regex: RegExp): RegExp {
	if (regex.global) {
		return regex;
	} else {
		return RegExp(regex.source, regex.flags + 'g');
	}
}
