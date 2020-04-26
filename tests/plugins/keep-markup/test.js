const expect = require('chai').expect;
const jsdom = require('jsdom')
const { JSDOM } = jsdom

require('../../../prism')
// fake DOM
global.self = {}
global.self.Prism = Prism
global.document = {}
document.createRange = function () {
}
global.self.document = document

require('../../../plugins/keep-markup/prism-keep-markup')

describe('Prism Keep Markup Plugin', function () {

	function execute (code) {
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
					return new JSDOM('').window.document.createTextNode('')
				},
				insertNode: function (node) {
					nodes.push(node)
				},
				detach: function () {
				}
			}
		}
		const beforeHighlight = Prism.hooks.all['before-highlight'][0]
		const afterHighlight = Prism.hooks.all['after-highlight'][0]
		const env = {
			element: new JSDOM(code).window.document.getElementsByTagName('code')[0],
			language: "javascript"
		}
		beforeHighlight(env)
		afterHighlight(env)
		return { start, end, nodes }
	}

	it('should keep <span> markup', function () {
		const result = execute(`<code class="language-javascript">x<span>a</span>y</code>`)
		expect(result.start.length).to.equal(1)
		expect(result.end.length).to.equal(1)
		expect(result.nodes.length).to.equal(1)
		expect(result.nodes[0].nodeName).to.equal('SPAN')
	})
	it('should preserve markup order', function () {
		const result = execute(`<code class="language-javascript">x<a></a><b></b>y</code>`)
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
		const result = execute(`<code class="language-javascript">xy<span>a</span></code>`)
		expect(result.start.length).to.equal(1)
		expect(result.end.length).to.equal(1)
		expect(result.nodes.length).to.equal(1)
		expect(result.nodes[0].nodeName).to.equal('SPAN')
	})
	// The markup is removed if it's the last element and the element's name is a single letter: a(nchor), b(old), i(talic)...
	// https://github.com/PrismJS/prism/issues/1618
	/*
	it('should keep last single letter empty markup', function () {
		const result = execute(`<code class="language-javascript">xy<a></a></code>`)
		expect(result.start.length).to.equal(1)
		expect(result.end.length).to.equal(1)
		expect(result.nodes.length).to.equal(1)
		expect(result.nodes[0].nodeName).to.equal('A')
	})
	*/
})
