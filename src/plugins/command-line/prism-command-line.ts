import { getParentPre } from '../../shared/dom-util';
import { addHooks } from '../../shared/hooks-util';
import { htmlEncode } from '../../shared/util';
import type { StateKey } from '../../core/hook-state';
import type { PluginProto } from '../../types';

const CLASS_PATTERN = /(?:^|\s)command-line(?:\s|$)/;
const PROMPT_CLASS = 'command-line-prompt';

const commandLineKey: StateKey<CommandLineInfo> = 'command-line data';

interface CommandLineInfo {
	complete?: boolean;
	numberOfLines?: number;
	outputLines?: string[];
	continuationLineIndicies?: Set<number>;
}

export default {
	id: 'command-line',
	effect(Prism) {
		return addHooks(Prism.hooks, {
			'before-highlight': (env) => {
				const commandLine = env.state.get(commandLineKey, {});

				if (commandLine.complete || !env.code) {
					commandLine.complete = true;
					return;
				}

				// Works only for <code> wrapped inside <pre> (not inline).
				const pre = getParentPre(env.element);
				if (!pre || // Abort only if neither the <pre> nor the <code> have the class
					(!CLASS_PATTERN.test(pre.className) && !CLASS_PATTERN.test(env.element.className))) {
					commandLine.complete = true;
					return;
				}

				// The element might be highlighted multiple times, so we just remove the previous prompt
				const existingPrompt = env.element.querySelector('.' + PROMPT_CLASS);
				if (existingPrompt) {
					existingPrompt.remove();
				}

				const codeLines = env.code.split('\n');

				commandLine.numberOfLines = codeLines.length;
				const outputLines: string[] = commandLine.outputLines = [];

				const outputSections = pre.getAttribute('data-output');
				const outputFilter = pre.getAttribute('data-filter-output');
				if (outputSections !== null) { // The user specified the output lines. -- cwells
					outputSections.split(',').forEach((section) => {
						const range = section.split('-');
						let outputStart = parseInt(range[0], 10);
						let outputEnd = range.length === 2 ? parseInt(range[1], 10) : outputStart;

						if (!isNaN(outputStart) && !isNaN(outputEnd)) {
							if (outputStart < 1) {
								outputStart = 1;
							}
							if (outputEnd > codeLines.length) {
								outputEnd = codeLines.length;
							}
							// Convert start and end to 0-based to simplify the arrays. -- cwells
							outputStart--;
							outputEnd--;
							// Save the output line in an array and clear it in the code so it's not highlighted. -- cwells
							for (let j = outputStart; j <= outputEnd; j++) {
								outputLines[j] = codeLines[j];
								codeLines[j] = '';
							}
						}
					});
				} else if (outputFilter) { // Treat lines beginning with this string as output. -- cwells
					for (let i = 0; i < codeLines.length; i++) {
						if (codeLines[i].startsWith(outputFilter)) { // This line is output. -- cwells
							outputLines[i] = codeLines[i].slice(outputFilter.length);
							codeLines[i] = '';
						}
					}
				}

				const continuationLineIndicies = commandLine.continuationLineIndicies = new Set();
				const lineContinuationStr = pre.getAttribute('data-continuation-str');
				const continuationFilter = pre.getAttribute('data-filter-continuation');

				// Identify code lines where the command has continued onto subsequent
				// lines and thus need a different prompt. Need to do this after the output
				// lines have been removed to ensure we don't pick up a continuation string
				// in an output line.
				for (let j = 0; j < codeLines.length; j++) {
					const line = codeLines[j];
					if (!line) {
						continue;
					}

					// Record the next line as a continuation if this one ends in a continuation str.
					if (lineContinuationStr && line.endsWith(lineContinuationStr)) {
						continuationLineIndicies.add(j + 1);
					}
					// Record this line as a continuation if marked with a continuation prefix
					// (that we will remove).
					if (j > 0 && continuationFilter && line.startsWith(continuationFilter)) {
						codeLines[j] = line.slice(continuationFilter.length);
						continuationLineIndicies.add(j);
					}
				}

				env.code = codeLines.join('\n');
			},
			'before-insert': (env) => {
				const commandLine = env.state.get(commandLineKey, {});
				if (commandLine.complete) {
					return;
				}

				// Reinsert the output lines into the highlighted code. -- cwells
				const codeLines = env.highlightedCode.split('\n');
				const outputLines = commandLine.outputLines || [];
				for (let i = 0, l = codeLines.length; i < l; i++) {
					// Add spans to allow distinction of input/output text for styling
					if (outputLines.hasOwnProperty(i)) {
						// outputLines were removed from codeLines so missed out on escaping
						// of markup so do it here.
						codeLines[i] = '<span class="token output">'
							+ htmlEncode(outputLines[i]) + '</span>';
					} else {
						codeLines[i] = '<span class="token command">'
							+ codeLines[i] + '</span>';
					}
				}
				env.highlightedCode = codeLines.join('\n');
			},
			'complete': (env) => {
				const commandLine = env.state.get(commandLineKey, {});
				if (commandLine.complete) {
					return;
				}

				const pre = getParentPre(env.element);
				if (!pre) {
					return;
				}
				if (CLASS_PATTERN.test(env.element.className)) { // Remove the class "command-line" from the <code>
					env.element.className = env.element.className.replace(CLASS_PATTERN, ' ');
				}
				if (!CLASS_PATTERN.test(pre.className)) { // Add the class "command-line" to the <pre>
					pre.className += ' command-line';
				}

				const getAttribute = (key: string, defaultValue: string) => {
					return (pre.getAttribute(key) || defaultValue).replace(/"/g, '&quot');
				};

				// Create the "rows" that will become the command-line prompts. -- cwells
				let promptLines = '';
				const rowCount = commandLine.numberOfLines || 0;
				const promptText = getAttribute('data-prompt', '');
				let promptLine;
				if (promptText !== '') {
					promptLine = '<span data-prompt="' + promptText + '"></span>';
				} else {
					const user = getAttribute('data-user', 'user');
					const host = getAttribute('data-host', 'localhost');
					promptLine = '<span data-user="' + user + '" data-host="' + host + '"></span>';
				}

				const continuationLineIndicies = commandLine.continuationLineIndicies || new Set();
				const continuationPromptText = getAttribute('data-continuation-prompt', '>');
				const continuationPromptLine = '<span data-continuation-prompt="' + continuationPromptText + '"></span>';

				// Assemble all the appropriate prompt/continuation lines
				for (let j = 0; j < rowCount; j++) {
					if (continuationLineIndicies.has(j)) {
						promptLines += continuationPromptLine;
					} else {
						promptLines += promptLine;
					}
				}

				// Create the wrapper element. -- cwells
				const prompt = document.createElement('span');
				prompt.className = PROMPT_CLASS;
				prompt.innerHTML = promptLines;

				// Remove the prompt from the output lines. -- cwells
				const outputLines = commandLine.outputLines || [];
				for (let i = 0, l = outputLines.length; i < l; i++) {
					if (outputLines.hasOwnProperty(i)) {
						const node = prompt.children[i];
						node.removeAttribute('data-user');
						node.removeAttribute('data-host');
						node.removeAttribute('data-prompt');
					}
				}

				env.element.insertBefore(prompt, env.element.firstChild);
				commandLine.complete = true;
			}
		});
	}
} as PluginProto<'command-line'>;
