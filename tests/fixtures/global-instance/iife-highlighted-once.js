import { JSDOM } from 'jsdom';

// Without a page, the `prismjs` entry never highlights by itself
const { window } = new JSDOM();
Object.assign(globalThis, { window, document: window.document });

// A separate copy of the class, like the one inside the IIFE build, which already highlighted the page
const url = new URL('../../../src/core/classes/prism.js?copy', import.meta.url);
const { default: IifePrism } = await import(url.href);
const iife = new IifePrism();
globalThis.Prism = iife;

let highlightAllRuns = 0;
iife.hooks.add('before-highlightall', () => highlightAllRuns++);

const { default: prism } = await import('../../../src/index.js');
await prism.ready;

console.log(JSON.stringify({ highlightAllRuns }));
