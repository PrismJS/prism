const fs = require('fs');
const { assert } = require('chai');
const { Parser } = require('htmlparser2');
// use the JSON file because this file is less susceptible to merge conflicts
const { languages } = require('../components.json');


describe('Examples', function () {

	const exampleFiles = new Set(fs.readdirSync(__dirname + '/../examples'));
	const ignore = new Set([
		// these are libraries and not languages
		'markup-templating',
		't4-templating',
		// this does alter some languages but it's mainly a library
		'javadoclike'
	]);
	const validFiles = new Set();

	/** @type {string[]} */
	const missing = [];
	for (const lang in languages) {
		if (lang === 'meta') {
			continue;
		}

		const file = `prism-${lang}.html`;
		if (!exampleFiles.has(file)) {
			if (!ignore.has(lang)) {
				missing.push(lang);
			}
		} else {
			validFiles.add(file);
		}
	}

	const superfluous = [...exampleFiles].filter(f => !validFiles.has(f));


	it('- should be available for every language', function () {
		assert.isEmpty(missing, 'Following languages do not have an example file in ./examples/\n'
			+ missing.join('\n'));
	});

	it('- should only be available for registered languages', function () {
		assert.isEmpty(superfluous, 'Following files are not associated with any language\n'
			+ superfluous.map(f => `./examples/${f}`).join('\n'));
	});

	describe('Validate HTML templates', function () {
		for (const file of validFiles) {
			it('- ./examples/' + file, async function () {
				const content = fs.readFileSync(__dirname + '/../examples/' + file, 'utf-8');
				await validateHTML(content);
			});
		}
	});

});


/**
 * Validates the given HTML string of an example file.
 *
 * @param {string} html
 */
async function validateHTML(html) {
	const root = await parseHTML(html);

	/**
	 * @param {TagNode} node
	 */
	function checkCodeElements(node) {
		if (node.tagName === 'code') {
			assert.equal(node.children.length, 1,
				'A <code> element is only allowed to contain text, no tags. '
				+ 'Did you perhaps not escape all "<" characters?');

			const child = node.children[0];
			if (child.type !== 'text') {
				// throw to help TypeScript's flow analysis
				throw assert.equal(child.type, 'text', 'The child of a <code> element must be text only.');
			}

			const text = child.rawText;

			assert.notMatch(text, /</, 'All "<" characters have to be escape with "&lt;".');
			assert.notMatch(text, /&(?!amp;|lt;|gt;)(?:[#\w]+);/, 'Only certain entities are allowed.');
		} else {
			node.children.forEach(n => {
				if (n.type === 'tag') {
					checkCodeElements(n);
				}
			});
		}
	}

	for (const node of root.children) {
		if (node.type === 'text') {
			assert.isEmpty(node.rawText.trim(), 'All non-whitespace text has to be in <p> tags.');
		} else {
			// only known tags
			assert.match(node.tagName, /^(?:h2|h3|ol|p|pre|ul)$/, 'Only some tags are allowed as top level tags.');

			// <pre> elements must have only one child, a <code> element
			if (node.tagName === 'pre') {
				assert.equal(node.children.length, 1,
					'<pre> element must have one and only one child node, a <code> element.'
					+ ' This also means that spaces and line breaks around the <code> element are not allowed.');

				const child = node.children[0];
				if (child.type !== 'tag') {
					// throw to help TypeScript's flow analysis
					throw assert.equal(child.type, 'tag', 'The child of a <pre> element must be a <code> element.');
				}
				assert.equal(child.tagName, 'code', 'The child of a <pre> element must be a <code> element.');
			}

			checkCodeElements(node);
		}
	}
}

/**
 * Parses the given HTML fragment and returns a simple tree of the fragment.
 *
 * @param {string} html
 * @returns {Promise<TagNode>}
 *
 * @typedef TagNode
 * @property {"tag"} type
 * @property {string | null} tagName
 * @property {Object<string, string>} attributes
 * @property {(TagNode | TextNode)[]} children
 *
 * @typedef TextNode
 * @property {"text"} type
 * @property {string} rawText
 */
function parseHTML(html) {
	return new Promise((resolve, reject) => {
		/** @type {TagNode} */
		const tree = {
			type: 'tag',
			tagName: null,
			attributes: {},
			children: []
		};
		/** @type {TagNode[]} */
		let stack = [tree];

		const p = new Parser({
			onerror(err) {
				reject(err);
			},
			onend() {
				resolve(tree);
			},

			ontext(data) {
				stack[stack.length - 1].children.push({
					type: 'text',
					rawText: data
				});
			},

			onopentag(name, attrs) {
				/** @type {TagNode} */
				const newElement = {
					type: 'tag',
					tagName: name,
					attributes: attrs,
					children: []
				};
				stack[stack.length - 1].children.push(newElement);
				stack.push(newElement);
			},
			onclosetag() {
				stack.pop();
			}

		}, { lowerCaseTags: false });
		p.end(html);
	});
}
