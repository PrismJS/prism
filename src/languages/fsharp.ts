import clike from './clike';
import type { LanguageProto } from '../types';

export default {
	id: 'fsharp',
	alias: 'f#',
	base: clike,
	optional: 'markup',
	grammar ({ languages }) {
		return {
			'doc-comment': {
				pattern: /\/\/\/.*/,
				greedy: true,
				alias: 'comment',
				inside: {
					get 'tag'() {
						return languages.markup?.tag;
					},
				},
			},
			'comment': [
				{
					pattern: /(^|[^\\])\(\*(?!\))[\s\S]*?\*\)/,
					lookbehind: true,
					greedy: true,
				},
				{
					pattern: /(^|[^\\:])\/\/.*/,
					lookbehind: true,
					greedy: true,
				},
			],
			'string': {
				pattern: /(?:"""[\s\S]*?"""|@"(?:""|[^"])*"|"(?:\\[\s\S]|[^\\"])*")B?/,
				greedy: true,
			},
			'class-name': {
				pattern:
					/(\b(?:exception|inherit|interface|new|of|type)\s+|\w\s*:\s*|\s:\??>\s*)[.\w]+\b(?:\s*(?:->|\*)\s*[.\w]+\b)*(?!\s*[:.])/,
				lookbehind: true,
				inside: {
					'operator': /->|\*/,
					'punctuation': /\./,
				},
			},
			'keyword':
				/\b(?:let|return|use|yield)(?:!\B|\b)|\b(?:abstract|and|as|asr|assert|atomic|base|begin|break|checked|class|component|const|constraint|constructor|continue|default|delegate|do|done|downcast|downto|eager|elif|else|end|event|exception|extern|external|false|finally|fixed|for|fun|function|functor|global|if|in|include|inherit|inline|interface|internal|land|lazy|lor|lsl|lsr|lxor|match|member|method|mixin|mod|module|mutable|namespace|new|not|null|object|of|open|or|override|parallel|private|process|protected|public|pure|rec|sealed|select|sig|static|struct|tailcall|then|to|trait|true|try|type|upcast|val|virtual|void|volatile|when|while|with)\b/,
			'number': [
				/\b0x[\da-fA-F]+(?:LF|lf|un)?\b/,
				/\b0b[01]+(?:uy|y)?\b/,
				/(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[fm]|e[+-]?\d+)?\b/i,
				/\b\d+(?:[IlLsy]|UL|u[lsy]?)?\b/,
			],
			'operator':
				/([<>~&^])\1\1|([*.:<>&])\2|<-|->|[!=:]=|<?\|{1,3}>?|\??(?:<=|>=|<>|[-+*/%=<>])\??|[!?^&]|~[+~-]|:>|:\?>?/,
			$insert: {
				'preprocessor': {
					$before: 'keyword',
					pattern: /(^[\t ]*)#.*/m,
					lookbehind: true,
					alias: 'property',
					inside: {
						'directive': {
							pattern: /(^#)\b(?:else|endif|if|light|line|nowarn)\b/,
							lookbehind: true,
							alias: 'keyword',
						},
					},
				},

				'computation-expression': {
					$before: 'punctuation',
					pattern: /\b[_a-z]\w*(?=\s*\{)/i,
					alias: 'keyword',
				},

				'annotation': {
					$before: 'string',
					pattern: /\[<.+?>\]/,
					greedy: true,
					inside: {
						'punctuation': /^\[<|>\]$/,
						'class-name': {
							pattern: /^\w+$|(^|;\s*)[A-Z]\w*(?=\()/,
							lookbehind: true,
						},
						'annotation-content': {
							pattern: /[\s\S]+/,
							inside: 'fsharp',
						},
					},
				},
				'char': {
					$before: 'string',
					pattern:
						/'(?:[^\\']|\\(?:.|\d{3}|x[a-fA-F\d]{2}|u[a-fA-F\d]{4}|U[a-fA-F\d]{8}))'B?/,
					greedy: true,
				},
			},
		};
	},
} as LanguageProto<'fsharp'>;
