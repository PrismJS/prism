import { JSDOM } from 'jsdom';
import { loadIife } from './iife.js';

// Without a page, neither build highlights by itself
const { window } = new JSDOM();
Object.assign(globalThis, { window, document: window.document });

const iife = await loadIife();

let highlightAllRuns = 0;
iife.hooks.add('before-highlightall', () => highlightAllRuns++);

const { default: prism } = await import('../../../src/index.js');
await prism.ready;
await iife.ready;

console.log(JSON.stringify({ highlightAllRuns }));
