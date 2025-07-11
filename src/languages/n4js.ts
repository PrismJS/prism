import javascript from './javascript';
import type { LanguageProto } from '../types';

export default {
	id: 'n4js',
	base: javascript,
	alias: 'n4jsd',
	grammar () {
		return {
			// Keywords from N4JS language spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html
			'keyword':
				/\b(?:Array|any|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|module|new|null|number|package|private|protected|public|return|set|static|string|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/,
			$insert: {
				// Annotations in N4JS spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html#_annotations
				'annotation': {
					$before: 'constant',
					pattern: /@+\w+/,
					alias: 'operator',
				},
			},
		};
	},
} as LanguageProto<'n4js'>;
