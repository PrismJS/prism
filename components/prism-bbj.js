(function (Prism) {
	Prism.languages.bbj = {
		'comment': {
			pattern: /(^|[^\\:])rem\s+.*/i,
			lookbehind: true,
			greedy: true
		},
		'string': {
			pattern: /"(?:""|[!#$%&'()*,\/:;<=>?^\w +\-.])*"/,
			greedy: true
		},
		'number': /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:E[+-]?\d+)?/i,
		'keyword': /\b(?:abstract|all|argc|auto|begin|boolean|break|bye|case|catch|char|chn|class|classend|continue|ctl|day|declare|delete|dom|double|dread|dsz|else|endif|err|exitto|extends|fi|field|for|from|gosub|goto|if|implements|interface|interfaceend|iol|iolist|let|list|load|method|methodend|methodret|new|next|on|opts|pfx|private|process_events|protected|psz|public|read_resource|remove_callback|restore|return|rev|seterr|setesc|sqlchn|sqlunt|ssn|start|static|step|strictfp|super|swend|sys|then|this|throws|tim|to|try|unt|until|use|void|volatile|wend|where|while)\b/i,
		'function': /\b\w+(?=\()/,
		'boolean': /\b(?:BBjAPI\.TRUE|BBjAPI\.FALSE)\b/i,
		'operator': /<[=>]?|>=?|[+\-*\/^=&]|\b(?:and|not|or|xor)\b/i,
		'punctuation': /[,;:()]/
	};
}(Prism));
