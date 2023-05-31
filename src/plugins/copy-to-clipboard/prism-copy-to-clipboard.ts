import toolbar from '../toolbar/prism-toolbar';
import type { PluginProto } from '../../types';

interface CopyInfo {
	getText: () => string;
	success: () => void;
	error: (reason: unknown) => void;
}
/**
 * When the given elements is clicked by the user, the given text will be copied to clipboard.
 */
function registerClipboard(element: Element, copyInfo: CopyInfo) {
	element.addEventListener('click', () => {
		copyTextToClipboard(copyInfo);
	});
}

// https://stackoverflow.com/a/30810322/7595472

function fallbackCopyTextToClipboard(copyInfo: CopyInfo) {
	const textArea = document.createElement('textarea');
	textArea.value = copyInfo.getText();

	// Avoid scrolling to bottom
	textArea.style.top = '0';
	textArea.style.left = '0';
	textArea.style.position = 'fixed';

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		const successful = document.execCommand('copy');
		setTimeout(() => {
			if (successful) {
				copyInfo.success();
			} else {
				copyInfo.error(undefined);
			}
		}, 1);
	} catch (err) {
		setTimeout(() => {
			copyInfo.error(err);
		}, 1);
	}

	document.body.removeChild(textArea);
}
function copyTextToClipboard(copyInfo: CopyInfo) {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(copyInfo.getText()).then(copyInfo.success, () => {
			// try the fallback in case `writeText` didn't work
			fallbackCopyTextToClipboard(copyInfo);
		});
	} else {
		fallbackCopyTextToClipboard(copyInfo);
	}
}

/**
 * Selects the text content of the given element.
 */
function selectElementText(element: Element) {
	// https://stackoverflow.com/a/20079910/7595472
	window.getSelection()?.selectAllChildren(element);
}

function getInheritedAttribute(element: Element, attribute: string) {
	let e: Element | null = element;
	for (; e; e = e.parentElement) {
		const value = e.getAttribute(attribute);
		if (value !== null) {
			return value;
		}
	}
}

interface Settings {
	'copy': string;
	'copy-error': string;
	'copy-success': string;
	'copy-timeout': number;
}

/**
 * Traverses up the DOM tree to find data attributes that override the default plugin settings.
 *
 * @param startElement An element to start from.
 * @returns The plugin settings.
 */
function getSettings(startElement: Element) {
	const settings: Settings = {
		'copy': 'Copy',
		'copy-error': 'Press Ctrl+C to copy',
		'copy-success': 'Copied!',
		'copy-timeout': 5000
	};

	for (const k in settings) {
		const key = k as keyof Settings;
		const value = getInheritedAttribute(startElement, 'data-prismjs-' + key);
		if (value) {
			if (key === 'copy-timeout') {
				const n = Number(value);
				if (!Number.isNaN(n)) {
					settings[key] = n;
				}
			} else {
				settings[key] = value;
			}
		}
	}
	return settings;
}

export default {
	id: 'copy-to-clipboard',
	require: toolbar,
	effect(Prism) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const toolbar = Prism.plugins.toolbar!;

		return toolbar.registerButton('copy-to-clipboard', (env) => {
			const element = env.element;

			const settings = getSettings(element);

			const linkCopy = document.createElement('button');
			linkCopy.className = 'copy-to-clipboard-button';
			linkCopy.setAttribute('type', 'button');
			const linkSpan = document.createElement('span');
			linkCopy.appendChild(linkSpan);

			setState('copy');

			registerClipboard(linkCopy, {
				getText() {
					return element.textContent || '';
				},
				success() {
					setState('copy-success');

					resetText();
				},
				error() {
					setState('copy-error');

					setTimeout(() => {
						selectElementText(element);
					}, 1);

					resetText();
				}
			});

			return linkCopy;

			function resetText() {
				setTimeout(() => setState('copy'), settings['copy-timeout']);
			}

			function setState(state: 'copy' | 'copy-error' | 'copy-success') {
				linkSpan.textContent = settings[state];
				linkCopy.setAttribute('data-copy-state', state);
			}
		});
	}
} as PluginProto<'copy-to-clipboard'>;
