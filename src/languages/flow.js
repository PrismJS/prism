import { toArray } from '../util/iterables.js';
import { insertBefore } from '../util/language-util.js';
import javascript from './javascript.js';

/** @type {import('../types.d.ts').LanguageProto<'flow'>} */
export default {
	id: 'flow',
	base: javascript,
	grammar ({ base }) {
		insertBefore(base, 'keyword', {
			'type': {
				pattern:
					/\b(?:[Bb]oolean|Function|[Nn]umber|[Ss]tring|[Ss]ymbol|any|mixed|null|void)\b/,
				alias: 'class-name',
			},
		});

		insertBefore(base, 'operator', {
			'flow-punctuation': {
				pattern: /\{\||\|\}/,
				alias: 'punctuation',
			},
		});

		const fnVariable = /** @type {import('../types.d.ts').GrammarToken} */ (
			base['function-variable']
		);
		fnVariable.pattern =
			/(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/i;

		delete base['parameter'];

		return {
			'keyword': [
				{
					pattern: /(^|[^$]\b)(?:Class|declare|opaque|type)\b(?!\$)/,
					lookbehind: true,
				},
				{
					pattern:
						/(^|[^$]\B)\$(?:Diff|Enum|Exact|Keys|ObjMap|PropertyType|Record|Shape|Subtype|Supertype|await)\b(?!\$)/,
					lookbehind: true,
				},
				...toArray(base.keyword),
			],
		};
	},
};
