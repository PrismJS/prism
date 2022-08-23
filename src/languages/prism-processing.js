import { insertBefore } from '../shared/language-util.js';
import clike from './prism-clike.js';

export default /** @type {import("../types").LanguageProto} */ ({
	id: 'processing',
	require: clike,
	grammar({ extend }) {
		const processing = extend('clike', {
			'keyword': /\b(?:break|case|catch|class|continue|default|else|extends|final|for|if|implements|import|new|null|private|public|return|static|super|switch|this|try|void|while)\b/,
			// Spaces are allowed between function name and parenthesis
			'function': /\b\w+(?=\s*\()/,
			'operator': /<[<=]?|>[>=]?|&&?|\|\|?|[%?]|[!=+\-*\/]=?/
		});

		insertBefore(processing, 'number', {
			// Special case: XML is a type
			'constant': /\b(?!XML\b)[A-Z][A-Z\d_]+\b/,
			'type': {
				pattern: /\b(?:boolean|byte|char|color|double|float|int|[A-Z]\w*)\b/,
				alias: 'class-name'
			}
		});

		return processing;
	}
});
