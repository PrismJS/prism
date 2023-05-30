/* eslint-disable @typescript-eslint/no-non-null-assertion */
import rollupTypescript from '@rollup/plugin-typescript';
import CleanCSS from 'clean-css';
import fs from 'fs';
import { mkdir, readFile, readdir, rm, writeFile, } from 'fs/promises';
import path from 'path';
import { rollup } from 'rollup';
import { terser as rollupTerser } from 'rollup-plugin-terser';
import { webfont } from 'webfont';
import { toArray } from '../src/shared/util';
import { components } from './components';
import { parallel, runTask, series } from './tasks';
import type { ComponentProto } from '../src/types';
import type { OutputOptions, Plugin } from 'rollup';


const SRC_DIR = path.join(__dirname, '../src/');
const languageIds = fs.readdirSync(path.join(SRC_DIR, 'languages')).map((f) => f.slice('prism-'.length).slice(0, -'.js'.length)).sort();
const pluginIds = fs.readdirSync(path.join(SRC_DIR, 'plugins')).sort();

async function loadComponent(id: string) {
	let file;
	if (pluginIds.includes(id)) {
		file = path.join(SRC_DIR, `plugins/${id}/prism-${id}.ts`);
	} else {
		file = path.join(SRC_DIR, `languages/prism-${id}.ts`);
	}
	const exports = (await import(file)) as { default: ComponentProto };
	return exports.default;
}

async function minifyCSS() {
	const input: Record<string, string> = {};

	const THEMES_DIR = path.join(__dirname, '../themes');
	const themes = await readdir(THEMES_DIR);
	for (const theme of themes.filter((f) => /\.css$/i.test(f))) {
		input[`themes/${theme}`] = path.join(THEMES_DIR, theme);
	}

	for (const id of pluginIds) {
		const file = path.join(SRC_DIR, `plugins/${id}/prism-${id}.css`);
		if (fs.existsSync(file)) {
			input[`plugins/${id}/prism-${id}.css`] = file;
		}
	}

	const DIST = path.join(__dirname, '../dist');

	const clean = new CleanCSS({});

	await Promise.all(Object.entries(input).map(async ([target, file]) => {
		const content = await readFile(file, 'utf-8');
		const output = clean.minify(content);
		if (output.errors.length > 0) {
			throw new Error(`CSS minify error:\n${output.errors.join('\n')}`);
		}
		for (const warn of output.warnings) {
			console.warn(`${file}: ${warn}`);
		}

		const targetFile = path.join(DIST, target);
		await mkdir(path.dirname(targetFile), { recursive: true });
		await writeFile(targetFile, output.styles, 'utf-8');
	}));
}

async function treeviewIconFont() {
	// List of all icons
	// Add new icons to the end of the list.
	const iconList = [
		'file', 'folder',
		'image', 'audio', 'video',
		'text', 'code',
		'archive', 'pdf',
		'excel', 'powerpoint', 'word'
	];
	const fontName = 'PrismTreeview';

	// generate the font
	const result = await webfont({
		files: iconList.map((n) => `src/plugins/treeview-icons/icons/${n}.svg`),
		formats: ['woff'],
		fontName,
		sort: false
	});

	const woff = result.woff!;
	const glyphsData = result.glyphsData!;

	const fontFace = `
/* @GENERATED-FONT */
@font-face {
	font-family: "${fontName}";
	/**
	 * This font is generated from the .svg files in the \`icons\` folder. See the \`treeviewIconFont\` function in
	 * \`gulpfile.js/index.js\` for more information.
	 *
	 * Use the following escape sequences to refer to a specific icon:
	 *
	 * - ${glyphsData.map(({ metadata }) => {
		const codePoint = metadata!.unicode![0].codePointAt(0)!;
		return `\\${codePoint.toString(16)} ${metadata!.name}`;
	}).join('\n\t * - ')}
	 */
	src: url("data:application/font-woff;base64,${woff.toString('base64')}")
		format("woff");
}
`.trim();

	const cssPath = 'src/plugins/treeview-icons/prism-treeview-icons.css';
	const fontFaceRegex = /\/\*\s*@GENERATED-FONT\s*\*\/\s*@font-face\s*\{(?:[^{}/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/)*\}/;

	const css = fs.readFileSync(cssPath, 'utf-8');
	fs.writeFileSync(cssPath, css.replace(fontFaceRegex, fontFace), 'utf-8');
}

const dataToInsert = {
	aliases_placeholder: async () => {
		const data = await Promise.all([...languageIds, ...pluginIds].map(async (id) => {
			const proto = await loadComponent(id);
			return { id, alias: toArray(proto.alias) };
		}));
		return Object.fromEntries(data.flatMap(({ id, alias }) => alias.map((a) => [a, id])));
	},
	all_languages_placeholder: () => Promise.resolve(languageIds),
	title_placeholder: async () => {
		const rawTitles = new Map<string, string>();
		for (const [id, entry] of Object.entries(components.languages)) {
			if (id === 'meta') {
				continue;
			}

			rawTitles.set(id, entry.title);
			for (const [alias, title] of Object.entries(entry.aliasTitles || {})) {
				rawTitles.set(alias, title);
			}
		}

		const data = (await Promise.all(languageIds.map(async (id) => {
			const proto = await loadComponent(id);
			const title = rawTitles.get(id);
			if (!title) {
				throw new Error(`No title for ${id}`);
			}
			return [id, ...toArray(proto.alias)].map((name) => ({ name, title: rawTitles.get(id) ?? title }));
		}))).flat();
		data.push({ name: 'none', title: 'Plain text' });

		/**
		 * Tries to guess the name of a language given its id.
		 *
		 * @param name The language id.
		 */
		function guessTitle(name: string) {
			return (name.substring(0, 1).toUpperCase() + name.substring(1)).replace(/s(?=cript)/, 'S');
		}

		return Object.fromEntries(
			data.filter(({ name, title }) => guessTitle(name) !== title).map(({ name, title }) => [name, title])
		);
	}
};

const dataInsertPlugin: Plugin = {
	name: 'data-insert',
	async renderChunk(code, chunk) {
		const placeholderPattern = /\/\*\s*(\w+)\[\s*\*\/[\s\S]*?\/\*\s*\]\s*\*\//g;

		let result = '';
		let last = 0;
		let m;

		while ((m = placeholderPattern.exec(code))) {
			const [, name] = m;
			if (name in dataToInsert) {
				result += code.slice(last, m.index);
				last = m.index + m[0].length;

				const data = await dataToInsert[name as keyof typeof dataToInsert]();
				result += JSON.stringify(data);
			} else {
				throw new Error(`Unknown placeholder ${name} in ${chunk.fileName}`);
			}
		}

		if (last < code.length) {
			result += code.slice(last);
		}
		return result;
	},

};

const inlineRegexSourcePlugin: Plugin = {
	name: 'inline-regex-source',
	renderChunk(code) {
		return code.replace(
			/\/((?:[^\n\r[\\\/]|\\.|\[(?:[^\n\r\\\]]|\\.)*\])+)\/\s*\.\s*source\b/g,
			(m, source: string) => {
				// escape backslashes
				source = source.replace(/\\(.)|\[(?:\\s\\S|\\S\\s)\]/g, (m, g1: string) => {
					if (g1) {
						// characters like /\n/ can just be kept as "\n" instead of being escaped to "\\n"
						if (/[nrt0/]/.test(g1)) {
							return m;
						}
						if ('\\' === g1) {
							return '\\\\\\\\'; // escape using 4 backslashes
						}
						return '\\\\' + g1;
					} else {
						return '[^]';
					}
				});
				// escape single quotes
				source = source.replace(/'/g, "\\'");
				// wrap source in single quotes
				return "'" + source + "'";
			}
		);
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
 */
const lazyGrammarPlugin: Plugin = {
	name: 'lazy-grammar',
	renderChunk(code) {
		return code.replace(
			/^(?<indent>[ \t]+)grammar: (\{[\s\S]*?^\k<indent>\})/m,
			(m, _, grammar: string) => `\tgrammar: () => (${grammar})`
		);
	},
};

const terserPlugin = rollupTerser({
	ecma: 2015,
	module: true,
	compress: {
		passes: 4,
		unsafe: true,
		unsafe_arrows: true,
		unsafe_math: true,
		unsafe_regexp: true,
	},
	format: {
		comments: false
	},
	keep_classnames: true
});

async function clean() {
	const outputDir = path.join(__dirname, '../dist');
	await rm(outputDir, { recursive: true, force: true });
}

async function buildJS() {
	const input: Record<string, string> = {
		'core': path.join(SRC_DIR, 'core.ts'),
		'shared': path.join(SRC_DIR, 'shared.ts'),
	};
	for (const id of languageIds) {
		input[`languages/prism-${id}`] = path.join(SRC_DIR, `languages/prism-${id}.ts`);
	}
	for (const id of pluginIds) {
		input[`plugins/${id}/prism-${id}`] = path.join(SRC_DIR, `plugins/${id}/prism-${id}.ts`);
	}

	const outputOptions: OutputOptions = {
		dir: 'dist',
		chunkFileNames: '_chunks/[name]-[hash].js',
		validate: true,
		plugins: [
			lazyGrammarPlugin,
			dataInsertPlugin,
			inlineRegexSourcePlugin,
			terserPlugin
		]
	};

	let bundle;
	try {
		bundle = await rollup({
			input,
			plugins: [rollupTypescript({ module: 'esnext' })],
		});
		await bundle.write(outputOptions);
	} finally {
		await bundle?.close();
	}
}

runTask(series(clean, parallel(buildJS, series(treeviewIconFont, minifyCSS))));
