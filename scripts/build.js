import fs from 'fs';
import { copyFile, mkdir, readFile, rm, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import commonjs from '@rollup/plugin-commonjs';
import rollupTerser from '@rollup/plugin-terser';
import CleanCSS from 'clean-css';
import MagicString from 'magic-string';
import { rollup } from 'rollup';
import ts from 'typescript';
import { webfont } from 'webfont';
import components from '../src/components.json' with { type: 'json' };
import { toArray } from '../src/util/iterables.js';
import { parallel, runTask, series } from './tasks.js';

/** @typedef {import('rollup').OutputOptions} OutputOptions */
/** @typedef {import('rollup').Plugin} Plugin */
/** @typedef {import('rollup').RollupBuild} RollupBuild */
/** @typedef {import('rollup').RollupOptions} RollupOptions */
/** @typedef {import('rollup').SourceMapInput} SourceMapInput */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC_DIR = path.join(__dirname, '../src/');
const DIST_DIR = path.join(__dirname, '../dist');

const languageIds = fs
	.readdirSync(path.join(SRC_DIR, 'languages'))
	.map(f => f.slice(0, -'.js'.length))
	.sort();
const pluginIds = fs.readdirSync(path.join(SRC_DIR, 'plugins')).sort();
const themeIds = fs
	.readdirSync(path.join(SRC_DIR, 'themes'))
	.filter(f => /\.css$/i.test(f))
	.map(f => f.slice(0, -'.css'.length))
	.sort();

/**
 * @param {string} id
 */
async function loadComponent (id) {
	let file;
	if (pluginIds.includes(id)) {
		file = path.join(SRC_DIR, `plugins/${id}/${id}.js`);
	}
	else {
		file = path.join(SRC_DIR, `languages/${id}.js`);
	}
	const exports = await import(file);
	return exports.default;
}

async function minifyCSS () {
	const input = {};

	for (const id of themeIds) {
		input[`themes/${id}.css`] = path.join(SRC_DIR, `themes/${id}.css`);
	}

	for (const id of pluginIds) {
		const file = path.join(SRC_DIR, `plugins/${id}/${id}.css`);
		if (fs.existsSync(file)) {
			input[`plugins/${id}.css`] = file;
		}
	}

	const clean = new CleanCSS({});

	await Promise.all(
		Object.entries(input).map(async ([target, file]) => {
			const content = await readFile(file, 'utf-8');
			const output = clean.minify(content);
			if (output.errors.length > 0) {
				throw new Error(`CSS minify error:\n${output.errors.join('\n')}`);
			}
			for (const warn of output.warnings) {
				console.warn(`${file}: ${warn}`);
			}

			const targetFile = path.join(DIST_DIR, target);
			await mkdir(path.dirname(targetFile), { recursive: true });
			await writeFile(targetFile, output.styles, 'utf-8');
		})
	);
}

async function treeviewIconFont () {
	// List of all icons
	// Add new icons to the end of the list.
	const iconList = [
		'file',
		'folder',
		'image',
		'audio',
		'video',
		'text',
		'code',
		'archive',
		'pdf',
		'excel',
		'powerpoint',
		'word',
	];
	const fontName = 'PrismTreeview';

	// generate the font
	const result = await webfont({
		files: iconList.map(n => `src/plugins/treeview-icons/icons/${n}.svg`),
		formats: ['woff'],
		fontName,
		sort: false,
	});

	const woff = result.woff;
	const glyphsData = result.glyphsData;

	const fontFace = `
/* @GENERATED-FONT */
@font-face {
	font-family: "${fontName}";
	/**
	 * This font is generated from the .svg files in the \`icons\` folder. See the \`treeviewIconFont\` function in
	 * \`scripts/build.js\` for more information.
	 *
	 * Use the following escape sequences to refer to a specific icon:
	 *
	 * - ${glyphsData
			.map(({ metadata }) => {
				const codePoint = metadata.unicode[0].codePointAt(0);
				return `\\${codePoint.toString(16)} ${metadata.name}`;
			})
			.join('\n\t * - ')}
	 */
	src: url("data:application/font-woff;base64,${woff.toString('base64')}")
		format("woff");
}
`.trim();

	const cssPath = 'src/plugins/treeview-icons/treeview-icons.css';
	const fontFaceRegex =
		/\/\*\s*@GENERATED-FONT\s*\*\/\s*@font-face\s*\{(?:[^{}/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/)*\}/;

	const css = fs.readFileSync(cssPath, 'utf-8');
	fs.writeFileSync(cssPath, css.replace(fontFaceRegex, fontFace), 'utf-8');
}

const dataToInsert = {
	aliases_placeholder: async () => {
		const data = await Promise.all(
			[...languageIds, ...pluginIds].map(async id => {
				const proto = await loadComponent(id);
				return { id, alias: toArray(proto.alias) };
			})
		);
		return Object.fromEntries(data.flatMap(({ id, alias }) => alias.map(a => [a, id])));
	},
	all_languages_placeholder: () => Promise.resolve(languageIds),
	title_placeholder: async () => {
		/** @type {Map<string, string>} */
		const rawTitles = new Map();
		for (const [id, entry] of Object.entries(components.languages)) {
			if (id === 'meta') {
				continue;
			}

			rawTitles.set(id, entry.title);
			for (const [alias, title] of Object.entries(entry.aliasTitles || {})) {
				rawTitles.set(alias, title);
			}
		}

		const data = (
			await Promise.all(
				languageIds.map(async id => {
					const proto = await loadComponent(id);
					const title = rawTitles.get(id);
					if (!title) {
						throw new Error(`No title for ${id}`);
					}
					return [id, ...toArray(proto.alias)].map(name => ({
						name,
						title: rawTitles.get(id) ?? title,
					}));
				})
			)
		).flat();
		data.push({ name: 'none', title: 'Plain text' });

		/**
		 * Tries to guess the name of a language given its id.
		 *
		 * @param {string} name The language id.
		 */
		function guessTitle (name) {
			return (name.substring(0, 1).toUpperCase() + name.substring(1)).replace(
				/s(?=cript)/,
				'S'
			);
		}

		return Object.fromEntries(
			data
				.filter(({ name, title }) => guessTitle(name) !== title)
				.map(({ name, title }) => [name, title])
		);
	},
};

/** @type {Plugin} */
const dataInsertPlugin = {
	name: 'data-insert',
	async renderChunk (code, chunk) {
		const pattern = /\/\*\s*(\w+)\[\s*\*\/[\s\S]*?\/\*\s*\]\s*\*\//g;

		// search for placeholders
		/** @type {Set<string>} */
		const contained = new Set();
		let m;
		while ((m = pattern.exec(code))) {
			contained.add(m[1]);
		}

		if (contained.size === 0) {
			return null;
		}

		// fetch placeholder data
		const dataByName = {};
		for (const name of contained) {
			if (name in dataToInsert) {
				dataByName[name] = await dataToInsert[name]();
			}
			else {
				throw new Error(`Unknown placeholder ${name} in ${chunk.fileName}`);
			}
		}

		// replace placeholders
		const str = new MagicString(code);
		str.replace(pattern, (_, /** @type {string} */ name) => {
			return JSON.stringify(dataByName[name]);
		});
		return toRenderedChunk(str);
	},
};

/** @type {Plugin} */
const inlineRegexSourcePlugin = {
	name: 'inline-regex-source',
	renderChunk (code) {
		const str = new MagicString(code);
		str.replace(
			/\/((?:[^\n\r[\\\/]|\\.|\[(?:[^\n\r\\\]]|\\.)*\])+)\/\s*\.\s*source\b/g,
			(m, /** @type {string} */ source) => {
				// escape backslashes
				source = source.replace(
					/\\(.)|\[(?:\\s\\S|\\S\\s)\]/g,
					(m, /** @type {string} */ g1) => {
						if (g1) {
							// characters like /\n/ can just be kept as "\n" instead of being escaped to "\\n"
							if (/[nrt0/]/.test(g1)) {
								return m;
							}
							if ('\\' === g1) {
								return '\\\\\\\\'; // escape using 4 backslashes
							}
							return '\\\\' + g1;
						}
						else {
							return '[^]';
						}
					}
				);
				// escape single quotes
				source = source.replace(/'/g, "\\'");
				// wrap source in single quotes
				return "'" + source + "'";
			}
		);
		return toRenderedChunk(str);
	},
};

/**
 * This plugin wraps bare grammar objects into functions.
 *
 * When a grammar is defined as `{ id: 'foo', grammar: { ...tokens } }`, those tokens will be evaluated eagerly.
 * This is a problem because eagerly evaluating hundreds of grammars when loading a page and only using a few of them
 * is a waste of CPU and memory, and it causes the JS thread to be block for roughly 200ms during page load.
 *
 * @see https://github.com/PrismJS/prism/issues/2768
 *
 * @type {Plugin}
 */
const lazyGrammarPlugin = {
	name: 'lazy-grammar',
	renderChunk (code) {
		const str = new MagicString(code);
		str.replace(
			/^(?<indent>[ \t]+)grammar: (\{[\s\S]*?^\k<indent>\})/m,
			(m, _, /** @type {string} */ grammar) => `\tgrammar: () => (${grammar})`
		);
		return toRenderedChunk(str);
	},
};

/**
 * @param {MagicString} s
 * @returns {{ code: string; map: SourceMapInput }}
 */
function toRenderedChunk (s) {
	return {
		code: s.toString(),
		map: s.generateMap({ hires: true }),
	};
}

const terserPlugin = rollupTerser({
	ecma: 2020,
	module: true,
	compress: {
		passes: 4,
		unsafe: true,
		unsafe_arrows: true,
		unsafe_math: true,
		unsafe_regexp: true,
	},
	format: {
		comments: false,
	},
	keep_classnames: true,
});

async function clean () {
	const outputDir = path.join(__dirname, '../dist');
	const typesDir = path.join(__dirname, '../types');
	await Promise.all([
		rm(outputDir, { recursive: true, force: true }),
		rm(typesDir, { recursive: true, force: true }),
	]);
}

async function copyComponentsJson () {
	const from = path.join(SRC_DIR, 'components.json');
	const to = path.join(__dirname, '../dist/components.json');
	await copyFile(from, to);
}

async function buildTypes () {
	await mkdir('./types');

	// Copy existing type definitions
	const typeFiles = ['types.d.ts'];

	await Promise.all(
		typeFiles.map(file => copyFile(path.join(SRC_DIR, file), path.join('./types', file)))
	);

	const configPath = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');

	if (!configPath) {
		throw new Error('Could not find tsconfig.json');
	}

	const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
	const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, './');

	/** @type {ts.CompilerOptions} */
	const compilerOptions = {
		...parsedConfig.options,
		declaration: true,
		emitDeclarationOnly: true,
		outDir: './types',
		rootDir: './src',
		noEmit: false,
		noEmitOnError: false,
	};

	const program = ts.createProgram(parsedConfig.fileNames, compilerOptions);

	program.emit();
}

async function buildJS () {
	const input = {
		'index': path.join(SRC_DIR, 'index.js'),
		'global': path.join(SRC_DIR, 'global.js'),
		'prism': path.join(SRC_DIR, 'prism.global.js'),
		'shared': path.join(SRC_DIR, 'shared.js'),
	};
	for (const id of languageIds) {
		input[`languages/${id}`] = path.join(SRC_DIR, `languages/${id}.js`);
	}
	for (const id of pluginIds) {
		input[`plugins/${id}`] = path.join(SRC_DIR, `plugins/${id}/${id}.js`);
	}

	/** @type {RollupOptions} */
	const defaultRollupOptions = {
		input,
		plugins: [lazyGrammarPlugin, dataInsertPlugin, inlineRegexSourcePlugin, terserPlugin],
	};

	/** @type {OutputOptions} */
	const defaultOutputOptions = {
		dir: './dist',
		validate: true,
		sourcemap: 'hidden',
	};

	const bundles = {
		esm: {
			rollupOptions: defaultRollupOptions,
			outputOptions: defaultOutputOptions,
		},
		cjs: {
			rollupOptions: {
				...defaultRollupOptions,
				plugins: [...defaultRollupOptions.plugins, commonjs()],
			},
			outputOptions: {
				...defaultOutputOptions,
				dir: './dist/cjs',
			},
		},
	};

	try {
		for (const bundle of Object.values(bundles)) {
			bundle.build = await rollup(bundle.rollupOptions);
			await bundle.build.write(bundle.outputOptions);
		}
	}
	finally {
		for (const bundle of Object.values(bundles)) {
			await bundle.build?.close();
		}
	}
}

// Helper to get file size in bytes, or 0 if not found
/**
 * @param {string} filePath
 */
const getFileSize = async filePath => {
	try {
		const stat = await fs.promises.stat(filePath);
		return stat.size;
	}
	catch {
		return 0;
	}
};

/**
 * @typedef {object} FileSizes
 * @property {number} [css]
 * @property {number} [js]
 */

async function calculateFileSizes () {
	const ret = {
		core: {},
		themes: {},
		languages: {},
		plugins: {},
	};

	ret.core.js = await getFileSize(path.join(DIST_DIR, 'index.js'));

	for (const category of ['themes', 'languages', 'plugins']) {
		let ids = themeIds;
		if (category === 'languages') {
			ids = languageIds;
		}
		else if (category === 'plugins') {
			ids = pluginIds;
		}

		for (const id of ids) {
			ret[category][id] = {};

			for (const ext of ['js', 'css']) {
				if (
					(ext === 'css' &&
						(category === 'languages' || components[category][id].noCSS)) ||
					(category === 'themes' && ext === 'js')
				) {
					continue;
				}

				const filePath = path.join(DIST_DIR, category, id);
				ret[category][id][ext] = await getFileSize(`${filePath}.${ext}`);
			}
		}
	}

	await fs.promises.writeFile(
		path.join(DIST_DIR, 'file-sizes.json'),
		JSON.stringify(ret, null, '\t')
	);
}

runTask(
	series(
		clean,
		parallel(buildTypes, buildJS, series(treeviewIconFont, minifyCSS)),
		copyComponentsJson,
		calculateFileSizes
	)
);
