import { JSDOM } from 'jsdom';

const { window } = new JSDOM('<div data-prism-silent="true"></div>');
Object.assign(globalThis, { window, document: window.document });

const { default: prism, Prism } = await import('../../../src/core/prism.js');

console.log(JSON.stringify({ global: prism.config.silent, created: new Prism().config.silent }));
