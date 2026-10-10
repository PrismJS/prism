import { JSDOM } from 'jsdom';

// Without a page, the `prismjs` entry never highlights by itself
const { window } = new JSDOM();
Object.assign(globalThis, { window, document: window.document });

// No IIFE build ran before, so this copy creates the global instance and must highlight the page
const { default: prism } = await import('../../../src/index.js');

let highlightAllRuns = 0;
prism.hooks.add('before-highlightall', () => highlightAllRuns++);

await prism.ready;

console.log(JSON.stringify({ highlightAllRuns }));
