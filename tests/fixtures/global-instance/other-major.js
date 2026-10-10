import { JSDOM } from 'jsdom';
import Prism from '../../../src/core/classes/prism.js';

const { window } = new JSDOM();
Object.assign(globalThis, { window, document: window.document });

// A separate copy of the class stands in for the IIFE build of another major version
const url = new URL('../../../src/core/classes/prism.js?copy', import.meta.url);
const { default: OtherPrism } = await import(url.href);
Prism.version = '2.0.0';
OtherPrism.version = '3.0.0';
const other = new OtherPrism();
globalThis.Prism = other;

let warnings = 0;
console.warn = () => warnings++;

const { default: prism } = await import('../../../src/core/prism.js');

console.log(JSON.stringify({ reused: prism === other, kept: globalThis.Prism === other, warnings }));
