const { testFunction } = require('./../helper/check-functionality');

function insertBeforeTest(inside, before, insert, root) {
	const details = `\ninsertBefore("${inside}", "${before}", ${insert}, ${root})`;

	// type checks
	if (typeof inside !== 'string') {
		throw new TypeError(`The inside argument has to be a 'string'.` + details);
	}
	if (typeof before !== 'string') {
		throw new TypeError(`The before argument has to be a 'string'.` + details);
	}
	if (typeof insert !== 'object') {
		throw new TypeError(`The insert argument has to be an 'object'.` + details);
	}
	if (root && typeof root !== 'object') {
		throw new TypeError(`The root argument has to be an 'object' if defined.` + details);
	}


	root = root || Prism.languages;
	var grammar = root[inside];

	if (typeof grammar !== 'object') {
		throw new Error(`The grammar "${inside}" has to be an 'object' not '${typeof grammar}'.`);
	}
	if (!(before in grammar)) {
		throw new Error(`"${before}" has to be a key of the grammar "${inside}".`);
	}
}

testFunction('insertBefore', Prism.languages, insertBeforeTest);
