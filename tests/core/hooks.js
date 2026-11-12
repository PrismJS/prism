import { assert } from 'chai';
import { Hooks } from '../../src/core/classes/hooks.js';

describe('Hooks', () => {
	it('should remove every hook of a map with the function add() returns', () => {
		const hooks = new Hooks();
		const calls = [];
		const off = hooks.add({
			'before-tokenize': () => calls.push('before'),
			'after-tokenize': () => calls.push('after'),
		});

		off();
		hooks.run('before-tokenize', {});
		hooks.run('after-tokenize', {});

		assert.deepEqual(calls, []);
	});

	it('should remove the callbacks of a map passed to remove()', () => {
		const hooks = new Hooks();
		const calls = [];
		const map = {
			'before-tokenize': () => calls.push('before'),
			'after-tokenize': () => calls.push('after'),
		};
		hooks.add(map);

		hooks.remove(map);
		hooks.run('before-tokenize', {});
		hooks.run('after-tokenize', {});

		assert.deepEqual(calls, []);
	});
});
