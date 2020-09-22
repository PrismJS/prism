"use strict";

function testFunction(name, object, tester) {
	const func = object[name];

	object[name] = function () {
		tester.apply(this, arguments);
		return func.apply(this, arguments);
	};
}

module.exports = (Prism) => {

	function extendTest(id, redef) {
		const details = `\nextend("${id}", ${redef})`;

		// type checks
		if (typeof id !== 'string') {
			throw new TypeError(`The id argument has to be a 'string'.` + details);
		}
		if (typeof redef !== 'object') {
			throw new TypeError(`The redef argument has to be an 'object'.` + details);
		}


		if (!(id in Prism.languages)) {
			throw new Error(`Cannot extend '${id}' because it is not defined in Prism.languages.`);
		}
	}

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

	testFunction('extend', Prism.languages, extendTest);
	testFunction('insertBefore', Prism.languages, insertBeforeTest);

};
