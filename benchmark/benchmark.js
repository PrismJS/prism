// @ts-check

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { argv } = require('yargs');
const fetch = require('node-fetch').default;
const Benchmark = require('benchmark');
const simpleGit = require('simple-git/promise');
const { parseLanguageNames } = require('../tests/helper/test-case');


/**
 * @param {import("./config").Config} config
 */
async function runBenchmark(config) {
	const cases = await getCases(config);
	const candidates = await getCandidates(config);
	const maxCandidateNameLength = candidates.reduce((a, c) => Math.max(a, c.name.length), 0);

	const totalNumberOfCaseFiles = cases.reduce((a, c) => a + c.files.length, 0);
	console.log(`Found ${cases.length} cases with ${totalNumberOfCaseFiles} files in total.`);
	console.log(`Test ${candidates.length} candidates with Prism.${config.options.testFunction}`);
	const estimate = candidates.length * totalNumberOfCaseFiles * config.options.maxTime;
	console.log(`Estimated duration: ${Math.floor(estimate / 60)}m ${Math.floor(estimate % 60)}s`);

	/**
	 * @type {Summary[]}
	 *
	 * @typedef {{ best: number; worst: number, relative: number[], avgRelative?: number }} Summary
	 */
	const totalSummary = Array.from({ length: candidates.length }, () => ({ best: 0, worst: 0, relative: [] }));

	for (const $case of cases) {

		console.log();
		console.log(`\x1b[90m${'-'.repeat(60)}\x1b[0m`);
		console.log();
		if ($case.id !== $case.language) {
			console.log(`${$case.id} (${$case.language})`);
		} else {
			console.log($case.id);
		}
		console.log();

		// prepare candidates
		const warmupCode = await fs.promises.readFile($case.files[0].path, 'utf8');
		/** @type {[string, (code: string) => void][]} */
		const candidateFunctions = candidates.map(({ name, setup }) => {
			const fn = setup($case.language, $case.languages);
			fn(warmupCode); // warmup
			return [name, fn];
		});


		// bench all files
		for (const caseFile of $case.files) {
			console.log(`  ${caseFile.uri} \x1b[90m(${Math.round(caseFile.size / 1024)} kB)\x1b[0m`);

			const code = await fs.promises.readFile(caseFile.path, 'utf8');

			const results = measureCandidates(candidateFunctions.map(([name, fn]) => [name, () => fn(code)]), {
				maxTime: config.options.maxTime,
				minSamples: 1,
				delay: 0,
			});

			const min = results.reduce((a, c) => Math.min(a, c.stats.mean), Infinity);
			const max = results.reduce((a, c) => Math.max(a, c.stats.mean), -Infinity);
			const minIndex = results.findIndex(x => x.stats.mean === min);
			const maxIndex = results.findIndex(x => x.stats.mean === max);

			totalSummary[minIndex].best++;
			totalSummary[maxIndex].worst++;

			const best = getBest(results);
			const worst = getWorst(results);

			results.forEach((r, index) => {
				const name = r.name.padEnd(maxCandidateNameLength, ' ');
				const mean = (r.stats.mean * 1000).toFixed(2).padStart(8) + 'ms';
				const r_moe = (100 * r.stats.moe / r.stats.mean).toFixed(0).padStart(3) + '%';
				const smp = r.stats.sample.length.toString().padStart(4) + 'smp';

				const relativeMean = r.stats.mean / min;
				totalSummary[index].relative.push(relativeMean);
				const relative = relativeMean === 1 ? ' '.repeat(5) : (relativeMean.toFixed(2) + 'x').padStart(5);

				const color = r === best ? '\x1b[32m' : r === worst ? '\x1b[31m' : '\x1b[0m';

				console.log(`  \x1b[90m| ${color}${name} ${mean} ±${r_moe} ${smp} ${relative}\x1b[0m`);
			});
		}
	}

	// total summary
	console.log();
	console.log(`\x1b[90m${'-'.repeat(60)}\x1b[0m`);
	console.log();
	console.log('summary');
	console.log(`${' '.repeat(maxCandidateNameLength + 2)}  \x1b[90mbest  worst  relative\x1b[0m`);

	totalSummary.forEach(s => {
		s.avgRelative = s.relative.reduce((a, c) => a + c, 0) / s.relative.length;
	});
	const minAvgRelative = totalSummary.reduce((a, c) => Math.min(a, c.avgRelative), Infinity);

	totalSummary.forEach((s, i) => {
		const name = candidates[i].name.padEnd(maxCandidateNameLength, ' ');
		const best = String(s.best).padStart('best'.length);
		const worst = String(s.worst).padStart('worst'.length);
		const relative = ((s.avgRelative / minAvgRelative).toFixed(2) + 'x').padStart('relative'.length);

		console.log(`  ${name}  ${best}  ${worst}  ${relative}`);
	});
}

function getConfig() {
	const base = require('./config.js');

	const args = /** @type {Record<string, unknown>} */(argv);

	if (typeof args.testFunction === 'string') {
		// @ts-ignore
		base.options.testFunction = args.testFunction;
	}
	if (typeof args.maxTime === 'number') {
		base.options.maxTime = args.maxTime;
	}
	if (typeof args.language === 'string') {
		base.options.language = args.language;
	}
	if (typeof args.remotesOnly === 'boolean') {
		base.options.remotesOnly = args.remotesOnly;
	}

	return base;
}

/**
 * @param {import("./config").Config} config
 * @returns {Promise<Case[]>}
 *
 * @typedef Case
 * @property {string} id
 * @property {string} language The main language.
 * @property {string[]} languages All languages that have to be loaded.
 * @property {FileInfo[]} files
 */
async function getCases(config) {
	/** @type {Map<string, ReadonlySet<FileInfo>>} */
	const caseFileCache = new Map();

	/**
	 * Returns all files of the test case with the given id.
	 *
	 * @param {string} id
	 * @returns {Promise<ReadonlySet<FileInfo>>}
	 */
	async function getCaseFiles(id) {
		if (caseFileCache.has(id)) {
			return caseFileCache.get(id);
		}

		const caseEntry = config.cases[id];
		if (!caseEntry) {
			throw new Error(`Unknown case "${id}"`);
		}

		/** @type {Set<FileInfo>} */
		const files = new Set();
		caseFileCache.set(id, files);

		await Promise.all(toArray(caseEntry.files).map(async uri => {
			files.add(await getFileInfo(uri));
		}));
		for (const extendId of toArray(caseEntry.extends)) {
			(await getCaseFiles(extendId)).forEach(info => files.add(info));
		}

		return files;
	}

	/**
	 * Returns whether the case is enabled by the options provided by the user.
	 *
	 * @param {string[]} languages
	 * @returns {boolean}
	 */
	function isEnabled(languages) {
		if (config.options.language) {
			// test whether the given languages contain any of the required languages
			const required = new Set(config.options.language.split(/,/g).filter(Boolean));
			return languages.some(l => required.has(l));
		}

		return true;
	}

	/** @type {Case[]} */
	const cases = [];
	for (const id of Object.keys(config.cases)) {
		const parsed = parseLanguageNames(id);

		if (!isEnabled(parsed.languages)) {
			continue;
		}

		cases.push({
			id,
			language: parsed.mainLanguage,
			languages: parsed.languages,
			files: [...await getCaseFiles(id)].sort((a, b) => a.uri.localeCompare(b.uri)),
		});
	}

	cases.sort((a, b) => a.id.localeCompare(b.id));

	return cases;
}

/** @type {Map<string, Promise<FileInfo>>} */
const fileInfoCache = new Map();
/**
 * Returns the path and other information for the given file identifier.
 *
 * @param {string} uri
 * @returns {Promise<FileInfo>}
 *
 * @typedef {{ uri: string, path: string, size: number }} FileInfo
 */
function getFileInfo(uri) {
	let info = fileInfoCache.get(uri);
	if (info === undefined) {
		info = getFileInfoUncached(uri);
		fileInfoCache.set(uri, info);
	}
	return info;
}
/**
 * @param {string} uri
 * @returns {Promise<FileInfo>}
 */
async function getFileInfoUncached(uri) {
	const p = await getFilePath(uri);
	const stat = await fs.promises.stat(p);
	if (stat.isFile()) {
		return {
			uri,
			path: p,
			size: stat.size
		};
	} else {
		throw new Error(`Unknown file "${uri}"`);
	}
}
/**
 * Returns the local path of the given file identifier.
 *
 * @param {string} uri
 * @returns {Promise<string>}
 */
async function getFilePath(uri) {
	if (/^https:\/\//.test(uri)) {
		// it's a URL, so let's download the file (if not downloaded already)
		const downloadDir = path.join(__dirname, 'downloads');
		await fs.promises.mkdir(downloadDir, { recursive: true });

		// file path
		const hash = crypto.createHash('md5').update(uri).digest('hex');
		const localPath = path.resolve(downloadDir, hash + '-' + /[-\w\.]*$/.exec(uri)[0]);

		if (!fs.existsSync(localPath)) {
			// download file
			console.log(`Downloading ${uri}...`);
			await fs.promises.writeFile(localPath, await fetch(uri).then(r => r.text()), 'utf8');
		}

		return localPath;
	}

	// assume that it's a local file
	return path.resolve(__dirname, uri);
}

/**
 * @param {Iterable<[string, () => void]>} candidates
 * @param {import("benchmark").Options} [options]
 * @returns {Result[]}
 *
 * @typedef {{ name: string, stats: import("benchmark").Stats }} Result
 */
function measureCandidates(candidates, options) {
	const suite = new Benchmark.Suite('temp name');

	for (const [name, fn] of candidates) {
		suite.add(name, fn, options);
	}

	/** @type {Result[]} */
	const results = [];

	suite.on('cycle', event => {
		results.push({
			name: event.target.name,
			stats: event.target.stats
		});
	}).run();

	return results;
}

/**
 * @param {Result[]} results
 * @returns {Result | null}
 */
function getBest(results) {
	if (results.length >= 2) {
		const sorted = [...results].sort((a, b) => a.stats.mean - b.stats.mean);
		const best = sorted[0].stats;
		const secondBest = sorted[1].stats;

		// basically, it's only the best if the two means plus their moe are disjoint
		if (best.mean + best.moe + secondBest.moe < secondBest.mean) {
			return sorted[0];
		}
	}

	return null;
}
/**
 * @param {Result[]} results
 * @returns {Result | null}
 */
function getWorst(results) {
	if (results.length >= 2) {
		const sorted = [...results].sort((a, b) => b.stats.mean - a.stats.mean);
		const worst = sorted[0].stats;
		const secondWorst = sorted[1].stats;

		// basically, it's only the best if the two means plus their moe are disjoint
		// (moe = margin of error; https://benchmarkjs.com/docs#stats_moe)
		if (worst.mean - worst.moe - secondWorst.moe > secondWorst.mean) {
			return sorted[0];
		}
	}

	return null;
}

/**
 * Create a new test function from the given Prism instance.
 *
 * @param {any} Prism
 * @param {string} mainLanguage
 * @param {string} testFunction
 * @returns {(code: string) => void}
 */
function createTestFunction(Prism, mainLanguage, testFunction) {
	if (testFunction === 'tokenize') {
		return (code) => {
			Prism.tokenize(code, Prism.languages[mainLanguage]);
		};
	} else if (testFunction === 'highlight') {
		return (code) => {
			Prism.highlight(code, Prism.languages[mainLanguage], mainLanguage);
		};
	} else {
		throw new Error(`Unknown test function "${testFunction}"`);
	}

}

/**
 * @param {import("./config").Config} config
 * @returns {Promise<Candidate[]>}
 *
 * @typedef Candidate
 * @property {string} name
 * @property {(mainLanguage: string, languages: string[]) => (code: string) => void} setup
 */
async function getCandidates(config) {
	/** @type {Candidate[]} */
	const candidates = [];

	// local
	if (!config.options.remotesOnly) {
		const localPrismLoader = require('../tests/helper/prism-loader');
		candidates.push({
			name: 'local',
			setup(mainLanguage, languages) {
				const Prism = localPrismLoader.createInstance(languages);
				return createTestFunction(Prism, mainLanguage, config.options.testFunction);
			}
		});
	}

	// remotes

	// prepare base directory
	const remoteBaseDir = path.join(__dirname, 'remotes');
	await fs.promises.mkdir(remoteBaseDir, { recursive: true });

	const baseGit = simpleGit(remoteBaseDir);

	for (const remote of config.remotes) {
		const user = /[^/]+(?=\/prism.git)/.exec(remote.repo);
		const branch = remote.branch || 'master';
		const remoteName = `${user}@${branch}`;
		const remoteDir = path.join(remoteBaseDir, `${user}@${branch}`);

		let remoteGit;
		if (!fs.existsSync(remoteDir)) {
			console.log(`Cloning ${remote.repo}`);
			await baseGit.clone(remote.repo, remoteName);
			remoteGit = simpleGit(remoteDir);
		} else {
			remoteGit = simpleGit(remoteDir);
			await remoteGit.fetch('origin', branch); // get latest version of branch
		}
		await remoteGit.checkout(branch); // switch to branch

		const remotePrismLoader = require(path.join(remoteDir, 'tests/helper/prism-loader'));
		candidates.push({
			name: remoteName,
			setup(mainLanguage, languages) {
				const Prism = remotePrismLoader.createInstance(languages);
				return createTestFunction(Prism, mainLanguage, config.options.testFunction);
			}
		});
	}

	return candidates;
}

/**
 * A utility function that converts the given optional array-like value into an array.
 *
 * @param {T[] | T | undefined | null} value
 * @returns {readonly T[]}
 * @template T
 */
function toArray(value) {
	if (Array.isArray(value)) {
		return value;
	} else if (value != undefined) {
		return [value];
	} else {
		return [];
	}
}


runBenchmark(getConfig());
