import prism from '../../global.js';
import toolbar from '../toolbar/prism-toolbar.js';

/**
 * When the given elements is clicked by the user, the given text will be copied to clipboard.
 *
 * @param {Element} element
 * @param {CopyInfo} copyInfo
 */
function registerClipboard (element, copyInfo) {
	element.addEventListener('click', () => {
		copyTextToClipboard(copyInfo);
	});
}

// https://stackoverflow.com/a/30810322/7595472

/**
 * @param {CopyInfo} copyInfo
 */
function fallbackCopyTextToClipboard (copyInfo) {
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
			}
			else {
				copyInfo.error(undefined);
			}
		}, 1);
	}
	catch (err) {
		setTimeout(() => {
			copyInfo.error(err);
		}, 1);
	}

	document.body.removeChild(textArea);
}

/**
 * @param {CopyInfo} copyInfo
 */
function copyTextToClipboard (copyInfo) {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(copyInfo.getText()).then(copyInfo.success, () => {
			// try the fallback in case `writeText` didn't work
			fallbackCopyTextToClipboard(copyInfo);
		});
	}
	else {
		fallbackCopyTextToClipboard(copyInfo);
	}
}

/**
 * Selects the text content of the given element.
 *
 * @param {Element} element
 */
function selectElementText (element) {
	// https://stackoverflow.com/a/20079910/7595472
	window.getSelection()?.selectAllChildren(element);
}

/**
 * @param {Element} element
 * @param {string} attribute
 * @returns {string | null}
 */
function getInheritedAttribute (element, attribute) {
	/** @type {Element | null} */
	let e = element;
	for (; e; e = e.parentElement) {
		const value = e.getAttribute(attribute);
		if (value !== null) {
			return value;
		}
	}
	return null;
}

/**
 * Traverses up the DOM tree to find data attributes that override the default plugin settings.
 *
 * @param {Element} startElement An element to start from.
 * @returns {Settings} The plugin settings.
 */
function getSettings (startElement) {
	/** @type {Settings} */
	const settings = {
		'copy': 'Copy',
		'copy-error': 'Press Ctrl+C to copy',
		'copy-success': 'Copied!',
		'copy-timeout': 5000,
	};

	for (const k in settings) {
		const key = k;
		const value = getInheritedAttribute(startElement, 'data-prismjs-' + key);
		if (value) {
			if (key === 'copy-timeout') {
				const n = Number(value);
				if (!Number.isNaN(n)) {
					settings[key] = n;
				}
			}
			else {
				settings[key] = value;
			}
		}
	}
	return settings;
}

/** @type {import('../../types.d.ts').PluginProto<'copy-to-clipboard'>} */
const Self = {
	id: 'copy-to-clipboard',
	require: toolbar,
	effect (Prism) {
		/** @type {import('../toolbar/prism-toolbar.js').Toolbar} */
		const toolbar = Prism.plugins.toolbar;

		return toolbar.registerButton('copy-to-clipboard', env => {
			const element = env.element;

			const settings = getSettings(element);

			const linkCopy = document.createElement('button');
			linkCopy.className = 'copy-to-clipboard-button';
			linkCopy.setAttribute('type', 'button');
			const linkSpan = document.createElement('span');
			linkCopy.appendChild(linkSpan);

			setState('copy');

			registerClipboard(linkCopy, {
				getText () {
					return element.textContent || '';
				},
				success () {
					setState('copy-success');

					resetText();
				},
				error () {
					setState('copy-error');

					setTimeout(() => {
						selectElementText(element);
					}, 1);

					resetText();
				},
			});

			return linkCopy;

			function resetText () {
				setTimeout(() => setState('copy'), settings['copy-timeout']);
			}

			/**
			 * @param {'copy' | 'copy-error' | 'copy-success'} state
			 */
			function setState (state) {
				linkSpan.textContent = settings[state];
				linkCopy.setAttribute('data-copy-state', state);
			}
		});
	},
};

export default Self;

prism.components.add(Self);

/**
 * @typedef {object} CopyInfo
 * @property {function(): string} getText
 * @property {function(): void} success
 * @property {(reason: any) => void} error
 */

/**
 * @typedef {object} Settings
 * @property {string} copy
 * @property {string} copy-error
 * @property {string} copy-success
 * @property {number} copy-timeout
 */
