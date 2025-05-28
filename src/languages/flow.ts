import { toArray } from '../util/iterables';
import javascript from './javascript';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'flow',
	base: javascript,
	grammar ({ base }) {
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
				...toArray(base!['keyword']),
			],
			$insertBefore: {
				'operator': {
					'flow-punctuation': {
						pattern: /\{\||\|\}/,
						alias: 'punctuation',
					},
				},
				'keyword': {
					'type': {
						pattern:
							/\b(?:[Bb]oolean|Function|[Nn]umber|[Ss]tring|[Ss]ymbol|any|mixed|null|void)\b/,
						alias: 'class-name',
					},
				},
			},
			$merge: {
				'function-variable': {
					pattern:
						/(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/i,
				},
			},
			$delete: ['parameter'],
		} as unknown as Grammar;
	},
} as LanguageProto<'flow'>;
