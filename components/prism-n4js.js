/**
* @param {import("../prism.js").Prism} Prism
* @param {import("../prism.js").LoaderOptions} [options]
*/
import { loader as javascriptLoader } from "./prism-javascript.js"
export function loader (Prism, options) {
    if (typeof Prism === 'undefined') return
    if (options?.force !== true && Prism.languages['n4js']) {
      return
    }
	if (!Prism.languages.javascript) {
		javascriptLoader(Prism)
	}
	Prism.languages.n4js = Prism.languages.extend('javascript', {
		// Keywords from N4JS language spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html
		'keyword': /\b(?:Array|any|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|module|new|null|number|package|private|protected|public|return|set|static|string|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/
	});

	Prism.languages.insertBefore('n4js', 'constant', {
		// Annotations in N4JS spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html#_annotations
		'annotation': {
			pattern: /@+\w+/,
			alias: 'operator'
		}
	});

	Prism.languages.n4jsd = Prism.languages.n4js;
}