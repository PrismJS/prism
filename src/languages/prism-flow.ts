import { insertBefore } from '../shared/language-util';
import { toArray } from '../shared/util';
import javascript from './prism-javascript';
import type { GrammarToken, LanguageProto } from '../types';

export default {
	id: 'flow',
	require: javascript,
	grammar({ extend, getLanguage }) {
		const javascript = getLanguage('javascript');
		const flow = extend('javascript', {
			'keyword': [
				{
					pattern: /(^|[^$]\b)(?:Class|declare|opaque|type)\b(?!\$)/,
					lookbehind: true
				},
				{
					pattern: /(^|[^$]\B)\$(?:Diff|Enum|Exact|Keys|ObjMap|PropertyType|Record|Shape|Subtype|Supertype|await)\b(?!\$)/,
					lookbehind: true
				},
				...toArray(javascript['keyword'])
			]
		});

		insertBefore(flow, 'keyword', {
			'type': {
				pattern: /\b(?:[Bb]oolean|Function|[Nn]umber|[Ss]tring|[Ss]ymbol|any|mixed|null|void)\b/,
				alias: 'class-name'
			}
		});

		insertBefore(flow, 'operator', {
			'flow-punctuation': {
				pattern: /\{\||\|\}/,
				alias: 'punctuation'
			}
		});

		const fnVariable = flow['function-variable'] as GrammarToken;
		fnVariable.pattern = /(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/i;

		delete flow['parameter'];

		return flow;
	}
} as LanguageProto<'flow'>;
