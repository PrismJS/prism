import { Autoloader } from './plugins/autoloader/prism-autoloader.js';
import { CustomClass } from './plugins/custom-class/prism-custom-class.js';
import { FileHighlight } from './plugins/file-highlight/prism-file-highlight.js';
import { FilterHighlightAll } from './plugins/filter-highlight-all/prism-filter-highlight-all.js';
import { JsonpHighlight } from './plugins/jsonp-highlight/prism-jsonp-highlight.js';
import { LineHighlight } from './plugins/line-highlight/prism-line-highlight.js';
import { LineNumbers } from './plugins/line-numbers/prism-line-numbers.js';
import { NormalizeWhitespace } from './plugins/normalize-whitespace/prism-normalize-whitespace.js';
import { PreviewerCollection } from './plugins/previewers/prism-previewers.js';
import { Toolbar } from './plugins/toolbar/prism-toolbar.js';

declare interface KnownPlugins {
	autoloader: Autoloader;
	customClass: CustomClass;
	fileHighlight: FileHighlight;
	filterHighlightAll: FilterHighlightAll;
	jsonpHighlight: JsonpHighlight;
	lineHighlight: LineHighlight;
	lineNumbers: LineNumbers;
	normalizeWhitespace: NormalizeWhitespace;
	previewers: PreviewerCollection;
	toolbar: Toolbar;
}
