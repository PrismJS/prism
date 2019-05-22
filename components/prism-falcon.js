Prism.languages.falcon = Prism.languages.extend('javascript', {
	'number': [
		Prism.languages.javascript.number,
		{
			pattern: /\b(?:api)\b/
		}
	],
	'builtin': /\b(?:get|post|put|delete|head|byte|int|int8|int16|int32|int64|uint|uint8|uint64|int_t|int8_t|int16_t|int32_t|int64_t|uint_t|uint8_t|uint64_t|long|Long|float|Float|double|Double|boolean|Boolean|bool|Bool|string|String|binary|string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
});

Prism.languages.falcon['class-name'][0].pattern = /(\b(?:class|enum|extends|implements|instanceof|interface|new|struct)\s+)[\w.\\]+/;

Prism.languages.falcon['keyword'].push({
	pattern: /(^|[^.])\b(?:enum|struct)\b/,
	lookbehind: true
});

Prism.languages.falcon['comment'].push({
	pattern: /(^|[^\\])#.*/,
	lookbehind: true,
	greedy: true
});

if (Prism.languages.markup) {
	Prism.languages.markup.tag.addInlined('script', 'falcon');
}
