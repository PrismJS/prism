import { assert } from 'chai';
import { extend } from '../../src/util/extend.js';

describe('extend', () => {
	it('should support array $before and $after in $insert', () => {
		const base = {
			comment: /<!--[\s\S]*?-->/,
			tag: /<\/?[a-z][\s\S]*?>/i,
		};

		const beforeGrammar = extend(base, {
			$insert: {
				'attr-name': {
					$before: ['comment', 'tag'],
					pattern: /[a-z-]+(?==)/,
				},
			},
		});

		assert.deepStrictEqual(beforeGrammar.$insertBefore, {
			comment: { 'attr-name': { pattern: /[a-z-]+(?==)/ } },
			tag: { 'attr-name': { pattern: /[a-z-]+(?==)/ } },
		});

		const afterGrammar = extend(base, {
			$insert: {
				'attr-name': {
					$after: ['comment', 'tag'],
					pattern: /[a-z-]+(?==)/,
				},
			},
		});

		assert.deepStrictEqual(afterGrammar.$insertAfter, {
			comment: { 'attr-name': { pattern: /[a-z-]+(?==)/ } },
			tag: { 'attr-name': { pattern: /[a-z-]+(?==)/ } },
		});
	});
});
