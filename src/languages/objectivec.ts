import c from './c';
import type { Grammar, LanguageProto } from '../types';

export default {
	id: 'objectivec',
	base: c,
	alias: 'objc',
	grammar () {
		return {
			'string': {
				pattern: /@?"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
				greedy: true,
			},
			'keyword':
				/\b(?:asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|in|inline|int|long|register|return|self|short|signed|sizeof|static|struct|super|switch|typedef|typeof|union|unsigned|void|volatile|while)\b|(?:@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b/,
			'operator': /-[->]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/@]/,
			$delete: ['class-name'],
		} as Grammar;
	},
} as LanguageProto<'objectivec'>;
