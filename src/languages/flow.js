import { toArray } from '../util/iterables.js';
import javascript from './javascript.js';

/** @type {import('../types.d.ts').LanguageProto<'flow'>} */
export default {
	id: 'flow',
	base: javascript,
	grammar ({ base }) {
		const fnVariable = /** @type {import('../types.d.ts').GrammarToken} */ (
			base['function-variable']
		);
		fnVariable.pattern =
			/(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/i;

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
				...toArray(/** @type {import('../types.d.ts').GrammarTokens} */ (base).keyword),
			],
			$insert: {
				'type': {
					$before: 'keyword',
					pattern:
						/\b(?:[Bb]oolean|Function|[Nn]umber|[Ss]tring|[Ss]ymbol|any|mixed|null|void)\b/,
					alias: 'class-name',
				},
				'flow-punctuation': {
					$before: 'operator',
					pattern: /\{\||\|\}/,
					alias: 'punctuation',
				},
			},
			$delete: ['parameter'],
		};
	},
};
