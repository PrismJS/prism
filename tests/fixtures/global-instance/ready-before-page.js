import { JSDOM } from 'jsdom';

const { window } = new JSDOM();
Object.assign(globalThis, { window, document: window.document });

// jsdom loads the page at once, so pretend it is still loading
await new Promise(resolve => window.addEventListener('load', resolve));
let readyState = 'loading';
Object.defineProperty(document, 'readyState', { get: () => readyState });

// The instance gets ready before `prismjs` is imported, e.g. from `prismjs/global.js` in an earlier script
const { default: prism } = await import('../../../src/global.js');
await prism.ready;

let highlightAllRuns = { before: 0, after: 0 };
prism.hooks.add('before-highlightall', () => {
	highlightAllRuns[readyState === 'loading' ? 'before' : 'after']++;
});

await import('../../../src/index.js');
await new Promise(resolve => setTimeout(resolve));

readyState = 'interactive';
document.dispatchEvent(new window.Event('DOMContentLoaded'));
await new Promise(resolve => setTimeout(resolve));

console.log(JSON.stringify({ highlightAllRuns }));
