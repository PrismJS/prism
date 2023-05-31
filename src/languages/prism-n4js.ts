import { insertBefore } from '../shared/language-util';
import javascript from './prism-javascript';
import type { LanguageProto } from '../types';

export default {
	id: 'n4js',
	require: javascript,
	alias: 'n4jsd',
	grammar({ extend }) {
		const n4js = extend('javascript', {
			// Keywords from N4JS language spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html
			'keyword': /\b(?:Array|any|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|module|new|null|number|package|private|protected|public|return|set|static|string|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/
		});

		insertBefore(n4js, 'constant', {
			// Annotations in N4JS spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html#_annotations
			'annotation': {
				pattern: /@+\w+/,
				alias: 'operator'
			}
		});

		return n4js;
	}
} as LanguageProto<'n4js'>;
