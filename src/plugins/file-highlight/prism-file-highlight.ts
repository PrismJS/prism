import { setLanguage } from '../../shared/dom-util';
import { addHooks } from '../../shared/hooks-util';
import type { Prism } from '../../core';
import type { PluginProto } from '../../types';

const FAILURE_MESSAGE = (status: number, message: string) => {
	return `✖ Error ${status} while fetching file: ${message}`;
};
const LOADING_MESSAGE = 'Loading…';
const FAILURE_EMPTY_MESSAGE = '✖ Error: File does not exist or is empty';

/**
 * Loads the given file.
 *
 * @param src The URL or path of the source file to load.
 */
function loadFile(src: string, success: (result: string) => void, error: (reason: string) => void) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', src, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status < 400 && xhr.responseText) {
				success(xhr.responseText);
			} else {
				if (xhr.status >= 400) {
					error(FAILURE_MESSAGE(xhr.status, xhr.statusText));
				} else {
					error(FAILURE_EMPTY_MESSAGE);
				}
			}
		}
	};
	xhr.send(null);
}

const EXTENSIONS: Record<string, string | undefined> = {
	'js': 'javascript',
	'py': 'python',
	'rb': 'ruby',
	'ps1': 'powershell',
	'psm1': 'powershell',
	'sh': 'bash',
	'bat': 'batch',
	'h': 'c',
	'tex': 'latex'
};

const STATUS_ATTR = 'data-src-status';
const STATUS_LOADING = 'loading';
const STATUS_LOADED = 'loaded';
const STATUS_FAILED = 'failed';

const SELECTOR = 'pre[data-src]:not([' + STATUS_ATTR + '="' + STATUS_LOADED + '"])'
	+ ':not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';

export class FileHighlight {
	private Prism: Prism;

	/**
	 * @package
	 */
	constructor(Prism: Prism) {
		this.Prism = Prism;
	}

	/**
	 * Executes the File Highlight plugin for all matching `pre` elements under the given container.
	 *
	 * Note: Elements which are already loaded or currently loading will not be touched by this method.
	 *
	 * @param container Defaults to `document`.
	 */
	highlight(container: ParentNode = document) {
		const elements = container.querySelectorAll(SELECTOR);

		for (const element of elements) {
			this.Prism.highlightElement(element);
		}
	}
}

export default {
	id: 'file-highlight',
	plugin(Prism) {
		return new FileHighlight(Prism);
	},
	effect(Prism) {
		/**
		 * Parses the given range.
		 *
		 * This returns a range with inclusive ends.
		 */
		function parseRange(range: string | null | undefined): [number, number | undefined] | undefined {
			const m = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(range || '');
			if (m) {
				const start = Number(m[1]);
				const comma = m[2];
				const end = m[3];

				if (!comma) {
					return [start, start];
				}
				if (!end) {
					return [start, undefined];
				}
				return [start, Number(end)];
			}
			return undefined;
		}

		return addHooks(Prism.hooks, {
			'before-highlightall': (env) => {
				env.selector += ', ' + SELECTOR;
			},
			'before-sanity-check': (env) => {
				const pre = env.element as HTMLPreElement;

				if (!pre.matches(SELECTOR)) {
					return;
				}

				const src = pre.getAttribute('data-src');
				if (!src) {
					return;
				}

				env.code = ''; // fast-path the whole thing and go to complete

				pre.setAttribute(STATUS_ATTR, STATUS_LOADING); // mark as loading

				// add code element with loading message
				const code = pre.appendChild(document.createElement('CODE'));
				code.textContent = LOADING_MESSAGE;


				let language = env.language;
				if (language === 'none') {
					// the language might be 'none' because there is no language set;
					// in this case, we want to use the extension as the language
					const extension = /\.(\w+)$/.exec(src)?.[1] || 'none';
					language = EXTENSIONS[extension] || extension;
				}

				// set language classes
				setLanguage(code, language);
				setLanguage(pre, language);

				// preload the language
				const autoloader = Prism.plugins.autoloader;
				if (autoloader) {
					autoloader.preloadLanguages(language);
				}

				// load file
				loadFile(
					src,
					(text) => {
						// mark as loaded
						pre.setAttribute(STATUS_ATTR, STATUS_LOADED);

						// handle data-range
						const range = parseRange(pre.getAttribute('data-range'));
						if (range) {
							const lines = text.split(/\r\n?|\n/);

							// the range is one-based and inclusive on both ends
							let start = range[0];
							let end = range[1] == null ? lines.length : range[1];

							if (start < 0) { start += lines.length; }
							start = Math.max(0, Math.min(start - 1, lines.length));
							if (end < 0) { end += lines.length; }
							end = Math.max(0, Math.min(end, lines.length));

							text = lines.slice(start, end).join('\n');

							// add data-start for line numbers
							if (!pre.hasAttribute('data-start')) {
								pre.setAttribute('data-start', String(start + 1));
							}
						}

						// highlight code
						code.textContent = text;
						Prism.highlightElement(code);
					},
					(error) => {
						// mark as failed
						pre.setAttribute(STATUS_ATTR, STATUS_FAILED);

						code.textContent = error;
					}
				);
			}
		});
	}
} as PluginProto<'file-highlight'>;
