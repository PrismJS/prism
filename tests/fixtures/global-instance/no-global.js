import { JSDOM } from 'jsdom';

const { window } = new JSDOM();
Object.assign(globalThis, { window, document: window.document });

await import('../../../src/index.js');

console.log(JSON.stringify({ global: 'Prism' in globalThis }));
