'use strict';

require('@babel/register');
const { babel } = require('@rollup/plugin-babel');
const fs = require('fs');
const { rm } = require('fs/promises');
const { src, dest, series, parallel } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const path = require('path');
const pump = require('pump');
const { rollup } = require('rollup');
const { terser: rollupTerser } = require('rollup-plugin-terser');
const webfont = require('webfont').default;

const { changes, linkify } = require('./changelog');
const paths = require('./paths');


function buildPluginCSS(cb) {
	pump([src(paths.pluginsCSS), cleanCSS(), dest('dist/plugins')], cb);
}
function minifyThemes(cb) {
	pump([src(paths.themes), cleanCSS(), dest('dist/themes')], cb);
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

	/** @type {Buffer} */
	const woff = result.woff;
	/**
	 * @type {{ contents: string; srcPath: string; metadata: Metadata }[]}
	 * @typedef Metadata
	 * @property {string} path
	 * @property {string} name
	 * @property {string[]} unicode
	 * @property {boolean} renamed
	 * @property {number} width
	 * @property {number} height
	 * */
	const glyphsData = result.glyphsData;

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
		const codePoint = metadata.unicode[0].codePointAt(0);
		return `\\${codePoint.toString(16)} ${metadata.name}`;
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

/**
 * @type {(arg: unknown) => arg is readonly any[]}
 */
const isReadonlyArray = Array.isArray;

/**
 * Converts the given value to an array.
 *
 * If the given value is already an error, it will be returned as is.
 *
 * @param {T | readonly T[] | undefined | null} value
 * @returns {readonly T[]}
 * @template {{}} T
 */
function toArray(value) {
	if (isReadonlyArray(value)) {
		return value;
	} else if (value == null) {
		return [];
	} else {
		return [value];
	}
}

const SRC_DIR = path.join(__dirname, '../src/');
const languageIds = fs.readdirSync(path.join(SRC_DIR, 'languages')).map((f) => f.slice('prism-'.length).slice(0, -'.js'.length)).sort();
const pluginIds = fs.readdirSync(path.join(SRC_DIR, 'plugins')).sort();

/**
 * @param {string} id
 * @returns {Promise<import('../src/types').ComponentProto>}
 */
async function loadComponent(id) {
	let exports;
	if (pluginIds.includes(id)) {
		exports = require(path.join(SRC_DIR, `plugins/${id}/prism-${id}.js`));
	} else {
		exports = require(path.join(SRC_DIR, `languages/prism-${id}.js`));
	}
	return exports.default;
}

/** @type {Record<string, () => Promise<any>>} */
const dataToInsert = {
	aliases_placeholder: async () => {
		const data = await Promise.all([...languageIds, ...pluginIds].map(async (id) => {
			const proto = await loadComponent(id);
			return { id, alias: toArray(proto.alias) };
		}));
		return Object.fromEntries(data.flatMap(({ id, alias }) => alias.map((a) => [a, id])));
	},
	all_languages_placeholder: async () => languageIds,
	title_placeholder: async () => {
		// eslint-disable-next-line import/extensions
		const components = require('../src/components.json');
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
		 * @param {string} name The language id.
		 * @returns {string}
		 */
		function guessTitle(name) {
			return (name.substring(0, 1).toUpperCase() + name.substring(1)).replace(/s(?=cript)/, 'S');
		}

		return Object.fromEntries(
			data.filter(({ name, title }) => guessTitle(name) !== title).map(({ name, title }) => [name, title])
		);
	}
};

/** @type {import("rollup").Plugin} */
const dataInsertPlugin = {
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

				const data = await dataToInsert[name]();
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

/** @type {import("rollup").Plugin} */
const inlineRegexSourcePlugin = {
	name: 'inline-regex-source',
	renderChunk(code) {
		return code.replace(
			/\/((?:[^\n\r[\\\/]|\\.|\[(?:[^\n\r\\\]]|\\.)*\])+)\/\s*\.\s*source\b/g,
			(m, source) => {
				// escape backslashes
				source = source.replace(/\\(.)|\[(?:\\s\\S|\\S\\s)\]/g, (m, g1) => {
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
 * @type {import("rollup").Plugin}
 */
const lazyGrammarPlugin = {
	name: 'lazy-grammar',
	renderChunk(code) {
		return code.replace(
			/^(?<indent>[ \t]+)grammar: (\{[\s\S]*?^\k<indent>\})/m,
			(m, _, grammar) => `\tgrammar: () => (${grammar})`
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

const babelPlugin = babel({
	babelHelpers: 'bundled',
	babelrc: true,
});

async function clean() {
	const outputDir = path.join(__dirname, '../dist');
	await rm(outputDir, { recursive: true, force: true });
}

async function buildJS() {
	/** @type {Record<string, string>} */
	const input = {
		'core': path.join(SRC_DIR, 'core.js'),
		'shared': path.join(SRC_DIR, 'shared.js'),
	};
	for (const id of languageIds) {
		input[`languages/prism-${id}`] = path.join(SRC_DIR, `languages/prism-${id}.js`);
	}
	for (const id of pluginIds) {
		input[`plugins/${id}/prism-${id}`] = path.join(SRC_DIR, `plugins/${id}/prism-${id}.js`);
	}

	/** @type {import("rollup").OutputOptions} */
	const outputOptions = {
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
			plugins: [babelPlugin]
		});
		await bundle.write(outputOptions);
	} finally {
		await bundle?.close();
	}
}

module.exports = {
	build: series(clean, parallel(buildJS, buildPluginCSS, minifyThemes)),
	buildTreeviewCss: treeviewIconFont,
	changes,
	linkify
};
