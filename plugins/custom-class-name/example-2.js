// require prism and plugins
import Prism from 'prismjs';

// require the style map using CSS Modules
import tokenStyleMap from 'styles/demo/code-token.css';

// apply the style map
Prism.plugins.customClassName.use(tokenStyleMap)

// now Prism will auto highlight all elements after page loaded.

// or you can manually use Prism like in API Documentation:
var html = Prism.highlight('var foo = \'bar\'', Prism.languages.javascript);