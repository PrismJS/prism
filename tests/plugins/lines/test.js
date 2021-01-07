const { assert } = require('chai');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM();
const document = dom.window.document;
global.self = global;
global.document = document;
global.DOMParser = dom.window.DOMParser;
global.Node = dom.window.Node;

require('../../../prism');
require('../../../plugins/lines/prism-lines');

describe('Prism Lines Plugin', function () {

	Prism.hooks.add('lines-register', (env) => {
		// register a noop listener to active the Lines plugin
		env.listeners.push({});
	});

	function highlightedMarkup(text, language) {
		const pre = document.createElement('pre');
		pre.className = `language-${language}`;
		const code = pre.appendChild(document.createElement('code'));
		code.textContent = text;

		Prism.highlightElement(code);

		return code.innerHTML;
	}

	function processMarkup(markup, language) {
		const pre = document.createElement('pre');
		pre.className = `language-${language}`;
		const code = pre.appendChild(document.createElement('code'));
		code.className = `language-${language}`;

		const env = {
			element: code,
			highlightedCode: markup
		};

		Prism.hooks.run('before-insert', env);

		return env.highlightedCode;
	}

	it('- should split lines correctly', function () {
		assert.equal(highlightedMarkup(`/* a \n b */`, 'javascript'), [
			'<div class="prism-line"><span class="token comment">/* a \n</span></div>',
			'<div class="prism-line"><span class="token comment"> b */</span></div>'
		].join(''));

		assert.equal(highlightedMarkup(`var\n/* a \n b */\nbar\n=\n\n0;`, 'javascript'), [
			'<div class="prism-line"><span class="token keyword">var</span>\n</div>',
			'<div class="prism-line"><span class="token comment">/* a \n</span></div>',
			'<div class="prism-line"><span class="token comment"> b */</span>\n</div>',
			'<div class="prism-line">bar\n</div>',
			'<div class="prism-line"><span class="token operator">=</span>\n</div>',
			'<div class="prism-line">\n</div>',
			'<div class="prism-line"><span class="token number">0</span><span class="token punctuation">;</span></div>'
		].join(''));


		assert.equal(processMarkup(`foo\nfoo<x>foo\nfoo</x>`, 'javascript'), [
			'<div class="prism-line">foo\n</div>',
			'<div class="prism-line">foo<x>foo\n</x></div>',
			'<div class="prism-line"><x>foo</x></div>'
		].join(''));
	});

	it('- should handle zero-width elements correctly', function () {
		assert.equal(processMarkup(`<a></a>\n<a></a>\n<a></a>`, 'javascript'), [
			'<div class="prism-line"><a></a>\n</div>',
			'<div class="prism-line"><a></a>\n</div>',
			'<div class="prism-line"><a></a></div>'
		].join(''));

		assert.equal(processMarkup(`<x><y>\n</y></x>\n<x><y>\n</y><z></z></x>\n`, 'javascript'), [
			'<div class="prism-line"><x><y>\n</y></x></div>',
			'<div class="prism-line">\n</div>',
			'<div class="prism-line"><x><y>\n</y></x></div>',
			'<div class="prism-line"><x><z></z></x>\n</div>'
		].join(''));

		assert.equal(processMarkup(`<x><y><x/></y><z></z></x><y></y>`, 'javascript'), [
			'<div class="prism-line"><x><y><x></x></y><z></z></x><y></y></div>'
		].join(''));
	});

	it('- should not create empty last lines', function () {
		assert.equal(processMarkup(`foo`, 'javascript'), [
			'<div class="prism-line">foo</div>'
		].join(''));

		assert.equal(processMarkup(`foo\n`, 'javascript'), [
			'<div class="prism-line">foo\n</div>'
		].join(''));

		assert.equal(processMarkup(`foo\n\n`, 'javascript'), [
			'<div class="prism-line">foo\n</div>',
			'<div class="prism-line">\n</div>'
		].join(''));

		// the last line contains spaces and is therefore not empty
		assert.equal(processMarkup(`foo\n\n  `, 'javascript'), [
			'<div class="prism-line">foo\n</div>',
			'<div class="prism-line">\n</div>',
			'<div class="prism-line">  </div>'
		].join(''));
	});

	it('- should ignore comments', function () {
		assert.equal(processMarkup(`foo<!-- \n -->bar`, 'javascript'), [
			'<div class="prism-line">foo<!-- \n -->bar</div>'
		].join(''));
	});

});
