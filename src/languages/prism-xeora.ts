import markup from './prism-markup';
import type { LanguageProto } from '../types';

export default {
	id: 'xeora',
	require: markup,
	alias: 'xeoracube',
	grammar({ extend }) {
		const functionVariable = {
			pattern: /(?:[,|])@?(?:#+|[-+*~=^])?[\w.]+/,
			inside: {
				'punctuation': {
					pattern: /[,.|]/
				},
				'operator': {
					pattern: /#+|[-+*~=^@]/
				}
			}
		};

		return extend('markup', {
			'constant': {
				pattern: /\$(?:DomainContents|PageRenderDuration)\$/,
				inside: {
					'punctuation': {
						pattern: /\$/
					}
				}
			},
			'variable': {
				pattern: /\$@?(?:#+|[-+*~=^])?[\w.]+\$/,
				inside: {
					'punctuation': {
						pattern: /[$.]/
					},
					'operator': {
						pattern: /#+|[-+*~=^@]/
					}
				}
			},
			'function-inline': {
				pattern: /\$F:[-\w.]+\?[-\w.]+(?:,(?:(?:@[-#]*\w+\.[\w+.]\.*)*\|)*(?:(?:[\w+]|[-#*.~^]+[\w+]|=\S)(?:[^$=]|=+[^=])*=*|(?:@[-#]*\w+\.[\w+.]\.*)+(?:(?:[\w+]|[-#*~^][-#*.~^]*[\w+]|=\S)(?:[^$=]|=+[^=])*=*)?)?)?\$/,
				inside: {
					'variable': functionVariable,
					'punctuation': {
						pattern: /\$\w:|[$:?.,|]/
					}
				},
				alias: 'function'
			},
			'function-block': {
				pattern: /\$XF:\{[-\w.]+\?[-\w.]+(?:,(?:(?:@[-#]*\w+\.[\w+.]\.*)*\|)*(?:(?:[\w+]|[-#*.~^]+[\w+]|=\S)(?:[^$=]|=+[^=])*=*|(?:@[-#]*\w+\.[\w+.]\.*)+(?:(?:[\w+]|[-#*~^][-#*.~^]*[\w+]|=\S)(?:[^$=]|=+[^=])*=*)?)?)?\}:XF\$/,
				inside: {
					'variable': functionVariable,
					'punctuation': {
						pattern: /[$:{}?.,|]/
					}
				},
				alias: 'function'
			},
			'directive-inline': {
				pattern: /\$\w(?:#\d+\+?)?(?:\[[-\w.]+\])?:[-\/\w.]+\$/,
				inside: {
					'punctuation': {
						pattern: /\$(?:\w:|C(?:\[|#\d))?|[:{[\]]/,
						inside: {
							'tag': {
								pattern: /#\d/
							}
						}
					}
				},
				alias: 'function'
			},
			'directive-block-open': {
				pattern: /\$\w+:\{|\$\w(?:#\d+\+?)?(?:\[[-\w.]+\])?:[-\w.]+:\{(?:![A-Z]+)?/,
				inside: {
					'punctuation': {
						pattern: /\$(?:\w:|C(?:\[|#\d))?|[:{[\]]/,
						inside: {
							'tag': {
								pattern: /#\d/
							}
						}
					},
					'attribute': {
						pattern: /![A-Z]+$/,
						inside: {
							'punctuation': {
								pattern: /!/
							}
						},
						alias: 'keyword'
					}
				},
				alias: 'function'
			},
			'directive-block-separator': {
				pattern: /\}:[-\w.]+:\{/,
				inside: {
					'punctuation': {
						pattern: /[:{}]/
					}
				},
				alias: 'function'
			},
			'directive-block-close': {
				pattern: /\}:[-\w.]+\$/,
				inside: {
					'punctuation': {
						pattern: /[:{}$]/
					}
				},
				alias: 'function'
			}
		});
	}
} as LanguageProto<'xeora'>;
