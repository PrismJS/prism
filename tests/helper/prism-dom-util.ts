import { createPrismDOM } from './prism-loader';
import { assertEqual, useSnapshot } from './snapshot';
import { formatHtml } from './util';
import type { KebabToCamelCase } from '../../src/types';
import type { PrismDOM, PrismWindow } from './prism-loader';

interface AssertOptions {
	language?: string;
	code: string;
	format?: boolean;
	expected?: string | typeof useSnapshot;
}

export function createUtil(window: PrismWindow<{}>) {
	const { Prism, document } = window;

	return {
		assert: {
			highlight({ language = 'none', code, format = true, expected = useSnapshot }: AssertOptions) {
				let actual = Prism.highlight(code, language);
				if (format) {
					actual = formatHtml(actual);
				}
				assertEqual(actual, expected);
			},
			highlightElement({ language = 'none', code, format = true, expected = useSnapshot }: AssertOptions) {
				const element = document.createElement('code');
				element.classList.add('language-' + language);
				element.textContent = code;

				Prism.highlightElement(element);

				let actual = element.innerHTML;
				if (format) {
					actual = formatHtml(actual);
				}
				assertEqual(actual, expected);
			},
			highlightPreElement({ language = 'none', attributes = {}, code, format = false, expected = useSnapshot }: AssertOptions & { attributes?: Record<string, string> }) {
				const preElement = document.createElement('pre');
				for (const key in attributes) {
					const value = attributes[key];
					preElement.setAttribute(key, value);
				}
				preElement.classList.add('language-' + language);

				const codeElement = document.createElement('code');
				codeElement.textContent = code;
				preElement.appendChild(codeElement);

				Prism.highlightElement(codeElement);

				let actual = preElement.outerHTML;
				if (format) {
					actual = formatHtml(actual);
				}
				assertEqual(actual, expected);
			}
		},
	};
}

export type TestSuiteDom<T extends string> = PrismDOM<{ plugins: Record<KebabToCamelCase<T>, {}> }> & { util: ReturnType<typeof createUtil> };

export function createTestSuite<T extends string>(options: { languages?: string | string[]; plugins?: T | T[] }): {
	it: (title: string, fn: (dom: TestSuiteDom<T>) => void) => void
} {
	return {
		it: (title, fn) => {
			it(title, async () => {
				const dom = createPrismDOM();

				try {
					if (options.languages) {
						await dom.loadLanguages(options.languages);
					}
					if (options.plugins) {
						await dom.loadPlugins(options.plugins);
					}

					dom.withGlobals(() => {
						fn({ ...dom, util: createUtil(dom.window) } as TestSuiteDom<T>);
					});
				} finally {
					dom.window.close();
				}
			});
		}
	};
}
