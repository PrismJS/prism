import type { Autoloader } from './plugins/autoloader/prism-autoloader';
import type { CustomClass } from './plugins/custom-class/prism-custom-class';
import type { FileHighlight } from './plugins/file-highlight/prism-file-highlight';
import type { FilterHighlightAll } from './plugins/filter-highlight-all/prism-filter-highlight-all';
import type { JsonpHighlight } from './plugins/jsonp-highlight/prism-jsonp-highlight';
import type { LineHighlight } from './plugins/line-highlight/prism-line-highlight';
import type { LineNumbers } from './plugins/line-numbers/prism-line-numbers';
import type { NormalizeWhitespace } from './plugins/normalize-whitespace/prism-normalize-whitespace';
import type { PreviewerCollection } from './plugins/previewers/prism-previewers';
import type { Toolbar } from './plugins/toolbar/prism-toolbar';

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
