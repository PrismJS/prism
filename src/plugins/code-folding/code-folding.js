import prism from '../../global.js';
import { getParentPre, isActive } from '../../shared/dom-util.js';
import { noop } from '../../shared/util.js';

const PLUGIN_NAME = 'code-folding';
const MIN_LINES_TO_FOLD = 10;

function countLines(text) {
	if (!text) {
		return 0;
	}
	const matches = text.match(/\n/g);
	return matches ? matches.length + 1 : 1;
}

function createFoldingButton(isFolded) {
	const button = document.createElement('button');
	button.className = 'code-folding-toggle';
	button.setAttribute('type', 'button');
	button.setAttribute('aria-label', isFolded ? 'Expand code' : 'Collapse code');
	button.textContent = isFolded ? 'Expand' : 'Collapse';
	return button;
}

function foldCode(pre, codeElement) {
	const lines = codeElement.textContent.split('\n');
	const totalLines = lines.length;
	
	if (totalLines < MIN_LINES_TO_FOLD) {
		return;
	}

	const visibleLines = 5;
	const hiddenLineCount = totalLines - visibleLines;
	
	pre.classList.add('code-folded');
	
	const existingPlaceholder = pre.querySelector('.code-folding-placeholder');
	if (existingPlaceholder) {
		existingPlaceholder.remove();
	}
	
	const placeholder = document.createElement('div');
	placeholder.className = 'code-folding-placeholder';
	placeholder.textContent = hiddenLineCount + ' lines hidden';
	
	codeElement.parentNode.insertBefore(placeholder, codeElement.nextSibling);
}

function unfoldCode(pre) {
	pre.classList.remove('code-folded');
	
	const placeholder = pre.querySelector('.code-folding-placeholder');
	if (placeholder) {
		placeholder.remove();
	}
}

function toggleFold(pre, button) {
	const codeElement = pre.querySelector('code');
	if (!codeElement) {
		return;
	}
	
	const isFolded = pre.classList.contains('code-folded');
	
	if (isFolded) {
		unfoldCode(pre);
		button.textContent = 'Collapse';
		button.setAttribute('aria-label', 'Collapse code');
	} else {
		foldCode(pre, codeElement);
		button.textContent = 'Expand';
		button.setAttribute('aria-label', 'Expand code');
	}
}

function shouldAutoFold(pre, lineCount) {
	if (pre.hasAttribute('data-fold')) {
		const foldValue = pre.getAttribute('data-fold');
		return foldValue !== 'false';
	}
	
	const autoFoldThreshold = parseInt(pre.getAttribute('data-fold-threshold') || '50', 10);
	return lineCount > autoFoldThreshold;
}

export class CodeFolding {
	minLinesToFold = MIN_LINES_TO_FOLD;
	
	fold(element) {
		const pre = element.tagName === 'PRE' ? element : getParentPre(element);
		if (!pre) {
			return;
		}
		
		const codeElement = pre.querySelector('code');
		if (!codeElement) {
			return;
		}
		
		foldCode(pre, codeElement);
		
		const button = pre.querySelector('.code-folding-toggle');
		if (button) {
			button.textContent = 'Expand';
			button.setAttribute('aria-label', 'Expand code');
		}
	}
	
	unfold(element) {
		const pre = element.tagName === 'PRE' ? element : getParentPre(element);
		if (!pre) {
			return;
		}
		
		unfoldCode(pre);
		
		const button = pre.querySelector('.code-folding-toggle');
		if (button) {
			button.textContent = 'Collapse';
			button.setAttribute('aria-label', 'Collapse code');
		}
	}
	
	toggle(element) {
		const pre = element.tagName === 'PRE' ? element : getParentPre(element);
		if (!pre) {
			return;
		}
		
		const button = pre.querySelector('.code-folding-toggle');
		if (button) {
			toggleFold(pre, button);
		}
	}
}

const Self = {
	id: 'code-folding',
	plugin() {
		return new CodeFolding();
	},
	effect(Prism) {
		if (typeof document === 'undefined') {
			return noop;
		}
		
		const completeHook = Prism.hooks.add('complete', env => {
			if (!env.code) {
				return;
			}
			
			const codeElement = env.element;
			const pre = getParentPre(codeElement);
			
			if (!pre) {
				return;
			}
			
			if (pre.querySelector('.code-folding-toggle')) {
				return;
			}
			
			if (!isActive(codeElement, PLUGIN_NAME)) {
				return;
			}
			
			const lineCount = countLines(env.code);
			
			if (lineCount < MIN_LINES_TO_FOLD) {
				return;
			}
			
			pre.classList.add(PLUGIN_NAME);
			
			const button = createFoldingButton(false);
			pre.insertBefore(button, pre.firstChild);
			
			button.addEventListener('click', () => {
				toggleFold(pre, button);
			});
			
			if (shouldAutoFold(pre, lineCount)) {
				foldCode(pre, codeElement);
				button.textContent = 'Expand';
				button.setAttribute('aria-label', 'Expand code');
			}
		});
		
		return completeHook;
	},
};

export default Self;

prism.components.add(Self);
