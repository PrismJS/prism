Prism.languages.racket = Prism.languages.extend('scheme', {});

// Add brackets to racket
Prism.languages.DFS(Prism.languages.racket, function (key, value) {
	if (Prism.util.type(value) === 'RegExp') {
		var source = value.source.replace(/\\(.)|\[\^?((?:\\.|[^\\\]])*)\]/g, function (m, g1, g2) {
			if (g1) {
				if (g1 === '(') {
					// replace all '(' characters outside character sets
					return '[([]';
				}
				if (g1 === ')') {
					// replace all ')' characters outside character sets
					return '[)\\]]';
				}
			}
			if (g2) {
				var prefix = m[1] === '^' ? '[^' : '[';
				return prefix + g2.replace(/\\(.)|[()]/g, function (m, g1) {
					if (m === '(' || g1 === '(') {
						// replace all '(' characters inside character sets
						return '([';
					}
					if (m === ')' || g1 === ')') {
						// replace all ')' characters inside character sets
						return ')\\]';
					}
					return m;
				}) + ']';
			}
			return m;
		});

		this[key] = RegExp(source, value.flags);
	}
});

Prism.languages.insertBefore('racket', 'string', {
	'lang': {
		pattern: /^#lang.+/m,
		greedy: true,
		alias: 'keyword'
	}
});

Prism.languages.rkt = Prism.languages.racket;
