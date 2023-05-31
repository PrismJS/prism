import bash from './prism-bash';
import type { LanguageProto } from '../types';

export default {
	id: 'shell-session',
	require: bash,
	alias: ['sh-session', 'shellsession'],
	grammar() {
		// CAREFUL!
		// The following patterns are concatenated, so the group referenced by a back reference is non-obvious!

		const strings = [
			// normal string
			/"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/.source,
			/'[^']*'/.source,
			/\$'(?:[^'\\]|\\[\s\S])*'/.source,

			// here doc
			// 2 capturing groups
			/<<-?\s*(["']?)(\w+)\1\s[\s\S]*?[\r\n]\2/.source
		].join('|');

		return {
			'command': {
				pattern: RegExp(
					// user info
					/^/.source +
						'(?:' +
						(
							// <user> ":" ( <path> )?
							/[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+(?::[^\0-\x1F$#%*?"<>:;|]+)?/.source +
							'|' +
							// <path>
							// Since the path pattern is quite general, we will require it to start with a special character to
							// prevent false positives.
							/[/~.][^\0-\x1F$#%*?"<>@:;|]*/.source
						) +
						')?' +
						// shell symbol
						/[$#%](?=\s)/.source +
						// bash command
						/(?:[^\\\r\n \t'"<$]|[ \t](?:(?!#)|#.*$)|\\(?:[^\r]|\r\n?)|\$(?!')|<(?!<)|<<str>>)+/.source.replace(/<<str>>/g, () => strings),
					'm'
				),
				greedy: true,
				inside: {
					'info': {
						// foo@bar:~/files$ exit
						// foo@bar$ exit
						// ~/files$ exit
						pattern: /^[^#$%]+/,
						alias: 'punctuation',
						inside: {
							'user': /^[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+/,
							'punctuation': /:/,
							'path': /[\s\S]+/
						}
					},
					'bash': {
						pattern: /(^[$#%]\s*)\S[\s\S]*/,
						lookbehind: true,
						alias: 'language-bash',
						inside: 'bash'
					},
					'shell-symbol': {
						pattern: /^[$#%]/,
						alias: 'important'
					}
				}
			},
			'output': /.(?:.*(?:[\r\n]|.$))*/
		};
	}
} as LanguageProto<'shell-session'>;
