Prism.languages.falcon = Prism.languages.extend('javascript', {
	'number': [
		Prism.languages.javascript.number,
		{
			pattern: /\b(?:api)\b/
		}
	],
	'builtin': /\b(?:int(?:8|16|32|64)?(?:_t)?|uint(?:8|64)?(?:_t)?|Array|Bool|Boolean|Double|Float|Function|Long|Promise|String|any|binary|bool|boolean|boolean|byte|console|delete|double|float|get|head|long|never|number|post|put|string|string|symbol|unknown)\b/,
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
