(function (Prism) {

	Prism.languages.agda = {
		'comment': [
      /\{\-[\s\S]*?(?:\-\}|$)/,
      /\-\-.*/,
    ],
    'string': {
      pattern: /"(?:\\(?:\r\n|[\s\S])|(?!")[^\\\r\n])*"/,
      greedy: true,
    },
    'punctuation': /[(){}⦃⦄.;@]/,
    'class-name': {
      pattern: /((?:(?:data|record)) )[^\s{]+/,
      lookbehind: true,
    },
    'function': {
      pattern: /(\n\s*|^\s*)[^:\r\n]+?(?=:)/,
      lookbehind: true,
    },
    'operator': {
      pattern: /(^[(){}⦃⦄.;@\s]*|[(){}⦃⦄.;@\s]+)(?:[=|:∀→λ\\\?\_]|->)(?=[(){}⦃⦄.;@\s])/,
      lookbehind: true,
    },
    'keyword': {
      pattern: /\b(?:let|in|module|where|abstract|private|public|postulate|rewrite|with|record|constructor|field|open|infix|infixl|infixr|using|import|renaming|hiding|data|primitive|forall|Set|variable|tactic|instance|eta-equality|forall|inductive|macro|mutual|no-eta-equality|overlap|pattern|quote|quoteContext|quoteGoal|quoteTerm|syntax|unquote|unquoteDecl|unquoteDef)\b/,
    },
	};
}(Prism));
