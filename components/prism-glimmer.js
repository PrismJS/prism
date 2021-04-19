/* eslint-disable no-use-before-define */
/*tri
* Much of this implementation is copied from highlightjs-glimmer
*
*/
function setup(Prism) {
	// Merged: https://github.com/emberjs/rfcs/pull/560
	const _EQUALITY_HELPERS = 'eq neq';

	// Merged: https://github.com/emberjs/rfcs/pull/561
	const _NUMERIC_COMPARISON_HELPERS = 'gt gte le lte';

	// Merged: https://github.com/emberjs/rfcs/pull/562/files
	const _LOGICAL_OPERATOR_HELPERS = 'and or not';

	const _BLOCK_HELPERS = 'let each each-in if else unless';
	const _DEBUG_HELPERS = 'log debugger';
	const _INLINE_HELPERS = 'has-block concat fn component helper modifier get hash query-params';
	const _MODIFIERS = 'action on';
	const _SPECIAL = 'outlet yield';
	const _LITERALS = 'true false undefined null';

	function toKeywords(spaceSep) {
		return new RegExp(`\\b(?:${spaceSep.split(' ').join('|')})\\b`);
	}


	// Open parenthesis for look-behind
	const parenOpen = '(\\()';
	const mustacheOpen = '(\\{\\{\\{?)';
	// Symbol name. See https://www.gnu.org/software/emacs/manual/html_node/elisp/Symbol-Type.html
	// & and : are excluded as they are usually used for special purposes
	const symbol = '[-+*/_~!@$%^=<>{}\\w]+';

	const COMPONENT_NAME_SEGMENT = /[A-Za-z0-9]+/;
	const COMPONENT_NAME = regex.either(
		COMPONENT_NAME_SEGMENT,
		/[a-zA-Z0-9]+\.[a-zA-Z0-9-]+/,
		regex.concat(COMPONENT_NAME_SEGMENT, /::/, /-?/, COMPONENT_NAME_SEGMENT),
	);

	const NUMBER = /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d+)?/;

	const STRING =  new RegExp(regex.either(
		/"[^{"]+/, /"/,
		/'[^{']+/, /'/,
		/"[^"]+"/,
		/'[^']+'/,
	));

	const Arg = {
		'parameter argument property': {
			pattern: /@[\w\d-_]+/,
		},
	};

	const Punctuation = {
		'punctuation': [
			{
				pattern: /[!#%&:()*+,.\/;<=>\[\\\]^`{|}~]+/,
			},
			{
				pattern: /^=/,
				alias: 'attr-equals'
			},
			{
				pattern: /\/?>/,
			},
		],
	};

	const FunctionName = {
		'function-name': [
			{
				pattern: new RegExp(parenOpen + symbol),
				lookbehind: true
			},
			{
				pattern: new RegExp(mustacheOpen + symbol),
				lookbehind: true
			}
		],
	};

	const Keywords = {
		'builtin': toKeywords([_MODIFIERS, _SPECIAL, _DEBUG_HELPERS, _BLOCK_HELPERS].join(' ')),
		'keyword': toKeywords([_INLINE_HELPERS, _LITERALS].join(' ')),
		'operator': toKeywords([_EQUALITY_HELPERS, _NUMERIC_COMPARISON_HELPERS, _LOGICAL_OPERATOR_HELPERS, 'as'].join(' ')),
	};

	const Helper = {
		'function': {
			greedy: true,
			pattern: /\([\S-_\d]+\b/,
			inside: {
				...Punctuation,
				...FunctionName,
				...Keywords,
			}
		}
	};

	const ThisExpression = {
		'this-expression': {
			pattern: /this\.[\S]+/,
			lookbehind: true,
			greedy: true,
			inside: {
				...Punctuation,
				'namespace': /this/,
				'property': /[\S]+/,
			}
		}
	};

	const MemberExpression = {
		'member-expression': {
			pattern: /[\S]+\.[\S]+/,
			lookbehind: true,
			greedy: true,
			inside: {
				...Punctuation,
				'constant': /[\S]+/,
				'property': /[\S]+/,
			}
		}
	};

	const INSIDE_MUSTACHE_AND_SUB_EXPRESSION = {
		...Helper,
		...Punctuation,
		...ThisExpression,
		...MemberExpression,
		...Arg,
		'number': NUMBER,
		'boolean': /\b(?:true|false)\b/,
		...Keywords,
		...FunctionName,
		'attr-name': /^[^=]+=/,
		'string': STRING,
		'variable': /\b[A-Za-z0-9_-]+\b/,
	};

	const SubExpression = {
		'sub-expression': {
			alias: 'punctuation',
			pattern: /\([^)]+\)/,
			lookbehind: true,
			greedy: true,
			inside: INSIDE_MUSTACHE_AND_SUB_EXPRESSION
		}
	};

	const Mustache = {
		'mustache': {
			pattern: /\{\{\{?\/?[^}]+?\}?\}\}/,
			lookbehind: true,
			alias: 'punctuation',
			greedy: true,
			inside: {
				...SubExpression,
				...INSIDE_MUSTACHE_AND_SUB_EXPRESSION,
			},
		},
	};

	const String = {
		'string': {
			pattern: STRING,
			inside: Mustache,
		},
	};

	INSIDE_MUSTACHE_AND_SUB_EXPRESSION['string'] = String.string;

	const {markup} = Prism.languages;

	if (!markup) {
		throw new Error('prism-markup is required');
	}

	Prism.languages.glimmer = {
		'comment': [
			{
				pattern: /\{\{!--[\s\S]*?--\}\}/,
			},
			{
				pattern: /\{\{![\s\S]*?\}\}/,
			},
		],
		'number': NUMBER,
		...Mustache,
		tag: {
			...markup.tag,
			inside: {
				'number': NUMBER,
				...Arg,
				...Mustache,
				'tag': {
					...markup.tag.inside.tag,
					inside: {
						...Punctuation,
						'class-name': new RegExp(COMPONENT_NAME),
					}
				},
				'attr-name': {
					pattern: /\b[^=\b]+=/,
					inside: {
						...String,
						...Punctuation,
						...Arg,
						...Mustache,
					},
				},
				...Punctuation,
				...String,
			},
		},
	};


	// if (Prism.languages.markup) {

	// }

	// if (Prism.languages.javascript) {
	// 	Prism.languages.gjs = Prism.languages.javascript;
	// }

	// if (Prism.languages.markdown) {

	// }

}



/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function lookahead(re) {
	return concat('(?=', re, ')');
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function optional(re) {
	return concat('(', re, ')?');
}

/**
 * @param {...(RegExp | string) } args
 * @returns {string}
 */
function concat(...args) {
	const joined = args.map((x) => source(x)).join('');

	return joined;
}

/**
 * Any of the passed expresssions may match
 *
 * Creates a huge this | this | that | that match
 * @param {(RegExp | string)[] } args
 * @returns {string}
 */
function either(...args) {
	const joined = '(' + args.map((x) => source(x)).join('|') + ')';

	return joined;
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function source(re) {
	if (!re) return null;
	if (typeof re === 'string') return re;

	return re.source;
}

const regex = {lookahead, either, optional, concat};

setup(Prism);
