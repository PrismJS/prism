import { insertBefore } from '../shared/language-util.js';
import javascript from './prism-javascript.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'flow',
	require: javascript,
	grammar({ extend }) {
		const flow = extend('javascript', {});

		insertBefore(flow, 'keyword', {
			'type': [
				{
					pattern: /\b(?:[Bb]oolean|Function|[Nn]umber|[Ss]tring|[Ss]ymbol|any|mixed|null|void)\b/,
					alias: 'class-name'
				}
			]
		});
		flow['function-variable'].pattern = /(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/i;
		delete flow['parameter'];

		insertBefore(flow, 'operator', {
			'flow-punctuation': {
				pattern: /\{\||\|\}/,
				alias: 'punctuation'
			}
		});

		if (!Array.isArray(flow.keyword)) {
			flow.keyword = [flow.keyword];
		}
		flow.keyword.unshift(
			{
				pattern: /(^|[^$]\b)(?:Class|declare|opaque|type)\b(?!\$)/,
				lookbehind: true
			},
			{
				pattern: /(^|[^$]\B)\$(?:Diff|Enum|Exact|Keys|ObjMap|PropertyType|Record|Shape|Subtype|Supertype|await)\b(?!\$)/,
				lookbehind: true
			}
		);

		return flow;
	}
});
