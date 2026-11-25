import { assert } from 'chai';
import { Prism } from '../../src/core/prism.js';

function textOf (stream) {
	return stream
		.map(x =>
			typeof x === 'string'
				? x
				: typeof x.content === 'string'
					? x.content
					: textOf(x.content))
		.join('');
}

describe('tokenizeByNamedGroups', () => {
	it('should emit disjoint named groups exactly once', () => {
		const prism = new Prism();
		const stream = prism.tokenize('ab', { token: { pattern: /(?<first>a)(?<second>b)/g } });

		assert.strictEqual(textOf(stream), 'ab');
	});

	it('should not duplicate the text of nested named groups', () => {
		const prism = new Prism();
		const stream = prism.tokenize('xabcx', {
			declaration: { pattern: /(?<outer>a(?<inner>b)c)/g },
		});

		assert.strictEqual(textOf(stream), 'xabcx');
	});

	it('should not duplicate the text of nested named groups sharing an end', () => {
		const prism = new Prism();
		const stream = prism.tokenize('xyz', { token: { pattern: /(?<a>x(?<b>yz))/g } });

		assert.strictEqual(textOf(stream), 'xyz');
	});

	it('should not duplicate the text of nested named groups sharing a start', () => {
		const prism = new Prism();
		const stream = prism.tokenize('xyz', { token: { pattern: /(?<a>(?<b>x)yz)/g } });

		assert.strictEqual(textOf(stream), 'xyz');
	});
});
