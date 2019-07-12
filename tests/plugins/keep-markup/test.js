const { expect } = require('chai');
const dom = require('../../helper/prism-loader').createPrismDOM();

const { Prism, document } = dom.window;

document.createRange = function () { }; // fake createRange for Keep Markup
dom.loadPlugins('keep-markup');


describe('Keep Markup', function () {

	function execute(code) {
		const start = [];
		const end = [];
		const nodes = [];
		document.createRange = function () {
			return {
				setStart: function (node, offset) {
					start.push({ node, offset })
				},
				setEnd: function (node, offset) {
					end.push({ node, offset })
				},
				extractContents: function () {
					return document.createTextNode('')
				},
				insertNode: function (node) {
					nodes.push(node)
				},
				detach: function () {
				}
			}
		};

		document.body.innerHTML = code;
		const element = document.body.firstElementChild;


		const beforeHighlight = Prism.hooks.all['before-highlight'][0];
		const afterHighlight = Prism.hooks.all['after-highlight'][0];

		const env = {
			element,
			language: "javascript"
		}
		beforeHighlight(env)
		afterHighlight(env)
		return { start, end, nodes }
	}

	it('should keep <span> markup', function () {
		const result = execute(`<code class="language-none">x<span>a</span>y</code>`)
		expect(result.start.length).to.equal(1)
		expect(result.end.length).to.equal(1)
		expect(result.nodes.length).to.equal(1)
		expect(result.nodes[0].nodeName).to.equal('SPAN')
	})
	it('should preserve markup order', function () {
		const result = execute(`<code class="language-none">x<a></a><b></b>y</code>`)
		expect(result.start.length).to.equal(2)
		expect(result.start[0].offset).to.equal(0)
		expect(result.start[0].node.textContent).to.equal('y')
		expect(result.start[1].offset).to.equal(0)
		expect(result.start[1].node.textContent).to.equal('y')
		expect(result.end.length).to.equal(2)
		expect(result.end[0].offset).to.equal(0)
		expect(result.end[0].node.textContent).to.equal('y')
		expect(result.end[1].offset).to.equal(0)
		expect(result.end[1].node.textContent).to.equal('y')
		expect(result.nodes.length).to.equal(2)
		expect(result.nodes[0].nodeName).to.equal('A')
		expect(result.nodes[1].nodeName).to.equal('B')
	})
	it('should keep last <span> markup', function () {
		const result = execute(`<code class="language-none">xy<span>a</span></code>`)
		expect(result.start.length).to.equal(1)
		expect(result.end.length).to.equal(1)
		expect(result.nodes.length).to.equal(1)
		expect(result.nodes[0].nodeName).to.equal('SPAN')
	})
	// The markup is removed if it's the last element and the element's name is a single letter: a(nchor), b(old), i(talic)...
	// https://github.com/PrismJS/prism/issues/1618
	/*
	it('should keep last single letter empty markup', function () {
		const result = execute(`<code class="language-none">xy<a></a></code>`)
		expect(result.start.length).to.equal(1)
		expect(result.end.length).to.equal(1)
		expect(result.nodes.length).to.equal(1)
		expect(result.nodes[0].nodeName).to.equal('A')
	})
	*/
})

after(() => {
	dom.window.close();
});
