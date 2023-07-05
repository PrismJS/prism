import type { Autoloader } from './plugins/autoloader/prism-autoloader.js';
import type { CustomClass } from './plugins/custom-class/prism-custom-class.js';
import type { FileHighlight } from './plugins/file-highlight/prism-file-highlight.js';
import type { FilterHighlightAll } from './plugins/filter-highlight-all/prism-filter-highlight-all.js';
import type { JsonpHighlight } from './plugins/jsonp-highlight/prism-jsonp-highlight.js';
import type { LineHighlight } from './plugins/line-highlight/prism-line-highlight.js';
import type { LineNumbers } from './plugins/line-numbers/prism-line-numbers.js';
import type { NormalizeWhitespace } from './plugins/normalize-whitespace/prism-normalize-whitespace.js';
import type { PreviewerCollection } from './plugins/previewers/prism-previewers.js';
import type { Toolbar } from './plugins/toolbar/prism-toolbar.js';

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
