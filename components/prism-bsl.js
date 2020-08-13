// 1C:Enterprise
// https://github.com/Diversus23/
// todo: Добавить англоязычные ключевые слова (add eng keywords).

Prism.languages.bsl = {
	'comment': /\/\/.*/,
	'string': [
		// strings
		{
			pattern: /"(?:[^"]|"")*"(?!")/,
			greedy: true
		},
		// date & time
		{
			pattern: /\'(?:\\?.)*?\'/,
			lookbehind: true			
		}
	],
	'keyword': [
		{
			// RU
			pattern: /\b(?:пока|для|новый|прервать|попытка|исключение|вызватьисключение|иначе|конецпопытки|неопределено|функция|перем|возврат|конецфункции|null|если|иначеесли|процедура|конецпроцедуры|тогда|знач|экспорт|или|конецесли|не|из|каждого|истина|ложь|по|цикл|конеццикла)\b/uig,
			lookbehind: true		
		},
		{
			// Eng
			pattern: /\b(?:while|for|new|break|try|except|raise|else|endtry|undefined|function|var|return|endfunction|null|if|elsif|procedure|endprocedure|then|val|export|or|endif|not|in|each|true|false|to|do|enddo)\b/ig,
			lookbehind: true
		}
	],
	'number': /(?:\b\d+\.?\d*|\B\.\d+)(?:E[+-]?\d+)?/i,
	'operator': [
		/\+|\)|\(|\.|\,|\\|\*|=|\:|;|<|>|\[|\]|\?/g,
		{
			pattern: /(^|[^&])\b(?:и|или|не|and|or|not)\b/,
			lookbehind: true
		}
	],
	'boolean': /\b(?:истина|ложь|true|false)\b/,
	'punctuation': /\(\.|\.\)|[()\[\]:;,.]/,	
	'directive': [
		// Теги препроцессора вида &Клиент and &Сервер
		{
			pattern: /^\s*&.*/gm,
			lookbehind: true,
			alias: 'important'
		},
		// Теги препроцессора вида #Область и #КонецОбласти
		{
			pattern: /^\s*#.*/gm,
			lookbehind: true,
			alias: 'important'
		}	
	]
};

Prism.languages.sdbl = Prism.languages['bsl'];
Prism.languages.os = Prism.languages['bsl'];
Prism.languages.oscript = Prism.languages['bsl'];