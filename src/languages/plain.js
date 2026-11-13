import registry from '../registry.js';

/** @type {import('../types.d.ts').LanguageProto<'plain'>} */
const Self = {
	id: 'plain',
	alias: ['text', 'txt', 'plaintext'],
	grammar: {},
};

export default Self;

registry.add(Self);
