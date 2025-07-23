import { toArray } from '../util/iterables';
import { insertBefore } from '../util/language-util';
import javascript from './javascript';
import type { GrammarToken, LanguageProto } from '../types';

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

		const fnVariable = base['function-variable'] as GrammarToken;
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
} as LanguageProto<'flow'>;
