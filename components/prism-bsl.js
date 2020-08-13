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
			pattern: /(?:(?<=[\p{L}\p{N}_])(?![\p{L}\p{N}_])|(?<![\p{L}\p{N}_])(?=[\p{L}\p{N}_]))(?:пока|для|новый|прервать|попытка|исключение|вызватьисключение|иначе|конецпопытки|неопределено|функция|перем|возврат|конецфункции|если|иначеесли|процедура|конецпроцедуры|тогда|знач|экспорт|конецесли|из|каждого|истина|ложь|по|цикл|конеццикла|истина|ложь)(?:(?<=[\p{L}\p{N}_])(?![\p{L}\p{N}_])|(?<![\p{L}\p{N}_])(?=[\p{L}\p{N}_]))/iu
		},
		{
			// EN
			pattern: /\b(?:while|for|new|break|try|except|raise|else|endtry|undefined|function|var|return|endfunction|null|if|elseif|procedure|endprocedure|then|val|export|endif|in|each|true|false|to|do|enddo|true|false)\b/i,
		}
	],
	'number': /(?:\b\d+\.?\d*|\B\.\d+)(?:E[+-]?\d+)?/i,
	'operator': [	
		/<[=]?|>[=]?|[+\-*\/]=?|[\%=]/i,
		// RU
		{
			pattern: /(?:(?<=[\p{L}\p{N}_])(?![\p{L}\p{N}_])|(?<![\p{L}\p{N}_])(?=[\p{L}\p{N}_]))(?:и|или|не)(?:(?<=[\p{L}\p{N}_])(?![\p{L}\p{N}_])|(?<![\p{L}\p{N}_])(?=[\p{L}\p{N}_]))/iu,
			lookbehind: true
		},		
		// EN
		{
			pattern: /(^|[^&])\b(?:and|or|not)\b/,
			lookbehind: true
		}
		
	],
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

Prism.languages.oscript = Prism.languages['bsl'];