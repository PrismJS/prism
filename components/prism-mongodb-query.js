(function (Prism) {

	var keywords = [
		'$eq',
		'$gt',
		'$gte',
		'$in',
		'$lt',
		'$lte',
		'$ne',
		'$nin',
		'$and',
		'$not',
		'$nor',
		'$or',
		'$exists',
		'$type',
		'$expr',
		'$jsonSchema',
		'$mod',
		'$regex',
		'$text',
		'$where',
		'$geoIntersects',
		'$geoWithin',
		'$near',
		'$nearSphere',
		'$box',
		'$center',
		'$centerSphere',
		'$geometry',
		'$maxDistance',
		'$minDistance',
		'$polygon',
		'$uniqueDocs',
		'$all',
		'$elemMatch',
		'$size',
		'$bitsAllClear',
		'$bitsAllSet',
		'$bitsAnyClear',
		'$bitsAnySet',
		'$comment',
		'$meta',
		'$slice',
		'$currentDate',
		'$inc',
		'$min',
		'$max',
		'$mul',
		'$rename',
		'$set',
		'$setOnInsert',
		'$unset',
		'$addToSet',
		'$pop',
		'$pull',
		'$push',
		'$pullAll',
		'$each',
		'$position',
		'$slice',
		'$sort',
		'$bit',
	];

	var functions = [
		'ObjectId',
		'Code',
		'BinData',
		'DBRef',
		'Timestamp',
		'NumberLong',
		'NumberDecimal',
		'MaxKey',
		'MinKey',
		'RegExp',
		'ISODate',
		'UUID',
	];

	keywords = keywords.map(function(keyword) { 
		return keyword.replace('$', '\\$');
	});

	var keywordsRegex = '(?:' + keywords.join('(?:\\b|:)|') + ')\\b';

	Prism.languages['mongodb-query'] = {
		'comment': [
			{
				pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
				lookbehind: true
			},
			{
				pattern: /(^|[^\\:])\/\/.*/,
				lookbehind: true,
				greedy: true
			}
		],
		'property': {
			pattern: /(?:[\$_a-z0-9]+|(['"])[\$[\]_a-z0-9.:-]+\1)(?=\s*:)/i,
			inside: {
				'keyword': RegExp('^([\'"])?' + keywordsRegex + '(?:\\1)?$')
			}
		},
		'string': {
			pattern: /(['"]).*?[^\\]\1/i,
			greedy: true,
			inside: {
				url: {
					// url pattern
					pattern: /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*/,  
					greedy: true
				},
				entity: {
					// ipv4
					pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/,  
					greedy: true  
				}
			}
		},
		"boolean": /\b(?:true|false)\b/,
		'constant': /\b(?:null|undefined)\b/,
		'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
		'function': RegExp('\\b(?:' + functions.join('|') + ')(?=\\s*\\()'),
		'punctuation': /[{}\[\]:,()]/,
	};

}(Prism));




