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


function testFunction(name, object, tester) {
	const func = object[name];

	object[name] = function () {
		tester.apply(this, arguments);
		return func.apply(this, arguments);
	};
}
testFunction('extend', Prism.languages, extendTest);
