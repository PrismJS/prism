import { JSDOM } from 'jsdom';
import ComponentRegistry from '../../../src/core/classes/component-registry.js';
import './set-version.js';

const { window } = new JSDOM();
Object.assign(globalThis, { window, document: window.document });

// A separate copy of the class stands in for the IIFE build of another major version, which puts its registry on its instance
const url = new URL('../../../src/core/classes/prism.js?copy', import.meta.url);
const { default: OtherPrism } = await import(url.href);
OtherPrism.version = process.argv[3];
const other = new OtherPrism();
other.registry = new ComponentRegistry();
globalThis.Prism = other;

let warnings = 0;
console.warn = () => warnings++;

const { default: prism } = await import('../../../src/core/prism.js');
const { default: registry } = await import('../../../src/registry.js');

console.log(
	JSON.stringify({
		reused: prism === other,
		kept: globalThis.Prism === other,
		ownRegistry: registry !== other.registry,
		warnings,
	})
);
