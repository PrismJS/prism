"use strict";

module.exports = {
	testFunction(name, object, tester) {
		const func = object[name];

		object[name] = function () {
			tester.apply(this, arguments);
			return func.apply(this, arguments);
		};
	}

}
