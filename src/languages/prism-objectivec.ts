import c from './prism-c';
import type { LanguageProto } from '../types';

export default {
	id: 'objectivec',
	require: c,
	alias: 'objc',
	grammar({ extend }) {
		const objectivec = extend('c', {
			'string': {
				pattern: /@?"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
				greedy: true
			},
			'keyword': /\b(?:asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|in|inline|int|long|register|return|self|short|signed|sizeof|static|struct|super|switch|typedef|typeof|union|unsigned|void|volatile|while)\b|(?:@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b/,
			'operator': /-[->]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/@]/
		});

		delete objectivec['class-name'];

		return objectivec;
	}
} as LanguageProto<'objectivec'>;
