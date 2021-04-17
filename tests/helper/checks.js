'use strict';

function testFunction(name, object, tester) {
	const func = object[name];

	object[name] = function () {
		tester.apply(this, arguments);
		return func.apply(this, arguments);
	};
}

/**
 * @param {readonly T[]} a1
 * @param {readonly T[]} a2
 * @returns {boolean}
 * @template T
 */
function arrayEqual(a1, a2) {
	if (a1.length !== a2.length) {
		return false;
	}
	for (let i = 0, l = a1.length; i < l; i++) {
		if (a1[i] !== a2[i]) {
			return false;
		}
	}
	return true;
}

/**
 * Returns a slice of the first array that doesn't contain the leading and trailing elements the both arrays have in
 * common.
 *
 * Examples:
 *
 *     trimCommon([1,2,3,4], [1,3,2,4]) => [2,3]
 *     trimCommon([1,2,3,4], [1,2,3,4]) => []
 *     trimCommon([1,2,0,0,3,4], [1,2,3,4]) => [0,0]
 *     trimCommon([1,2,3,4], [1,2,0,0,3,4]) => []
 *
 * @param {readonly T[]} a1
 * @param {readonly T[]} a2
 * @returns {T[]}
 * @template T
 */
function trimCommon(a1, a2) {
	let commonBefore = 0;
	for (let i = 0; i < a1.length; i++) {
		if (a1[i] === a2[i]) {
			commonBefore++;
		} else {
			break;
		}
	}
	a1 = a1.slice(commonBefore);
	let commonAfter = 0;
	for (let i = 0; i < a1.length; i++) {
		if (a1[a1.length - 1 - i] === a2[a2.length - 1 - i]) {
			commonAfter++;
		} else {
			break;
		}
	}
	return a1.slice(0, a1.length - commonAfter);
}

/**
 * @param {string[]} a
 */
function joinEnglishList(a) {
	if (a.length === 0) {
		return '(no elements)';
	} else if (a.length === 1) {
		return a[0];
	} else if (a.length === 2) {
		return `${a[0]} and ${a[1]}`;
	} else {
		return a.slice(0, a.length - 1).join(', ') + ', and ' + a[a.length - 1];
	}
}


module.exports = (Prism) => {

	// The test for Prism.languages.extend has to be able to tell whether an object is a clone, so we mark it with a
	// special property
	const oldClone = Prism.util.clone;
	Prism.util.clone = obj => {
		const clone = oldClone(obj);
		if (clone && typeof clone === 'object') {
			Object.defineProperty(clone, '__cloned', { value: true });
		}
		return clone;
	};


	function extendTest(id, redef) {
		let redefStr;
		if (Prism.util.type(redef) === 'Object') {
			redefStr = '{\n';
			for (const key in redef) {
				const element = redef[key];
				let elementStr;
				if (Array.isArray(element)) {
					elementStr = `[ ... ${element.length} element(s) ]`;
				} else if (Prism.util.type(element) === 'RegExp') {
					elementStr = 'RegExp';
				} else if (Prism.util.type(element) === 'Object') {
					elementStr = '{ ... }';
				} else {
					elementStr = String(element);
				}
				redefStr += `\t'${key}': ${elementStr},\n`;
			}
			redefStr += '}';
		} else {
			redefStr = String(redef);
		}
		const details = `\n\nActual method call (nonconforming):` +
			`\n\n\tPrism.languages.extend('${id}', ${redefStr.replace(/\n/g, '\n\t')});` +
			'\n\nFor more information see: https://prismjs.com/docs/Prism.languages.html#.extend';

		// type checks
		if (typeof id !== 'string') {
			throw new TypeError(`The id argument has to be a 'string'.` + details);
		}
		if (typeof redef !== 'object') {
			throw new TypeError(`The redef argument has to be an 'object'.` + details);
		}

		// language has to be loaded
		if (!(id in Prism.languages)) {
			throw new Error(`Cannot extend '${id}' because it is not defined in Prism.languages.`);
		}

		// rest property check
		if ('rest' in redef) {
			throw new Error(`The redef object is not allowed to contain a "rest" property.` + details);
		}

		// redef cannot be a direct reference to a language
		let isReference = false;
		Prism.languages.DFS(Prism.languages, (key, value) => {
			if (value === redef) {
				isReference = true;
			}
		});
		if (isReference) {
			throw new Error(`The redef object cannot be a reference to an existing language.` +
				` Use Prism.util.clone(object) to create a deep clone.` + details);
		}

		// check the order of properties in redef
		if (!redef.__cloned) {
			const languageKeys = Object.keys(Prism.languages[id]);
			const redefKeys = Object.keys(redef);
			const overwriteKeys = redefKeys.filter(k => languageKeys.indexOf(k) !== -1);
			const appendKeys = redefKeys.filter(k => languageKeys.indexOf(k) === -1);
			if (!arrayEqual(redefKeys, [...overwriteKeys, ...appendKeys])) {
				const lastOverwrite = overwriteKeys[overwriteKeys.length - 1];
				const lastOverwriteIndex = redefKeys.indexOf(lastOverwrite);
				const offenders = appendKeys.filter(k => redefKeys.indexOf(k) < lastOverwriteIndex);
				const offendersList = joinEnglishList(offenders.map(k => `'${k}'`));

				throw new Error(
					`All tokens in the redef object that do not overwrite tokens of the extended language have to be placed after the last token that does overwrite an existing token.` +
					` Move the token(s) ${offendersList} after the '${lastOverwrite}' token.` + details);
			}

			const sortedOverwriteKeys = [...overwriteKeys].sort((a, b) => {
				return languageKeys.indexOf(a) - languageKeys.indexOf(b);
			});
			if (!arrayEqual(overwriteKeys, sortedOverwriteKeys)) {
				const trimmedUnsorted = trimCommon(overwriteKeys, sortedOverwriteKeys).map(k => `'${k}'`).join(', ');
				const trimmedSorted = trimCommon(sortedOverwriteKeys, overwriteKeys).map(k => `'${k}'`).join(', ');
				throw new Error(
					'The tokens in the redef object that overwrite existing tokens of the extended language should be in the order of the existing tokens. ' +
					`The tokens ${trimmedUnsorted} should be in the order ${trimmedSorted}.` + details);
			}
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
		let grammar = root[inside];

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
