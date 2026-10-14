// The page sets the config before Prism loads, as in v1
globalThis.Prism = { silent: true };

const { default: prism } = await import('../../../src/core/prism.js');

console.log(JSON.stringify({ silent: prism.config.silent, kept: globalThis.Prism?.silent === true }));

export {};
