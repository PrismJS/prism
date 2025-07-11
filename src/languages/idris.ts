import haskell from './haskell';
import type { LanguageProto } from '../types';

export default {
	id: 'idris',
	base: haskell,
	alias: 'idr',
	grammar () {
		return {
			'comment': {
				pattern: /(?:(?:--|\|\|\|).*$|\{-[\s\S]*?-\})/m,
			},
			'keyword':
				/\b(?:Type|case|class|codata|constructor|corecord|data|do|dsl|else|export|if|implementation|implicit|import|impossible|in|infix|infixl|infixr|instance|interface|let|module|mutual|namespace|of|parameters|partial|postulate|private|proof|public|quoteGoal|record|rewrite|syntax|then|total|using|where|with)\b/,
			'builtin': undefined,
			$insert: {
				'import-statement': {
					$before: 'keyword',
					pattern: /(^\s*import\s+)(?:[A-Z][\w']*)(?:\.[A-Z][\w']*)*/m,
					lookbehind: true,
					inside: {
						'punctuation': /\./,
					},
				},
			},
		};
	},
} as LanguageProto<'idris'>;
