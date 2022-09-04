import { Autoloader } from './plugins/autoloader/prism-autoloader';
import { CustomClass } from './plugins/custom-class/prism-custom-class';
import { FileHighlight } from './plugins/file-highlight/prism-file-highlight';
import { FilterHighlightAll } from './plugins/filter-highlight-all/prism-filter-highlight-all';
import { JsonpHighlight } from './plugins/jsonp-highlight/prism-jsonp-highlight';
import { LineHighlight } from './plugins/line-highlight/prism-line-highlight';
import { LineNumbers } from './plugins/line-numbers/prism-line-numbers';
import { NormalizeWhitespace } from './plugins/normalize-whitespace/prism-normalize-whitespace';
import { PreviewerCollection } from './plugins/previewers/prism-previewers';
import { Toolbar } from './plugins/toolbar/prism-toolbar';

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
