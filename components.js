var components = {
	"core": {
		"meta": {
			"path": "components/prism-core.js",
			"option": "mandatory"
		},
		"core": "Core"
	},
	"themes": {
		"meta": {
			"path": "themes/{id}.css",
			"link": "index.html?theme={id}",
			"exclusive": true
		},
		"prism": {
			"title": "Default",
			"option": "default"
		},
		"prism-dark": "Dark",
		"prism-funky": "Funky",
		"prism-okaidia": {
			"title": "Okaidia",
			"owner": "ocodia"
		},
		"prism-twilight": {
			"title": "Twilight",
			"owner": "remybach"
		},
		"prism-coy": {
			"title": "Coy",
			"owner": "tshedor"
		}
	},
	"languages": {
		"meta": {
			"path": "components/prism-{id}",
			"noCSS": true
		},
		"markup": {
			"title": "Markup",
			"option": "default"
		},
		"twig": {
			"title": "Twig",
			"require": "markup",
			"owner": "brandonkelly"
		},
		"css": {
			"title": "CSS",
			"option": "default"
		},
		"css-extras": {
			"title": "CSS Extras",
			"require": "css",
			"owner": "milesj"
		},
		"clike": {
			"title": "C-like",
			"option": "default"
		},
		"javascript": {
			"title": "JavaScript",
			"option": "default",
			"require": "clike"
		},
		"java": {
			"title": "Java",
			"require": "clike",
			"owner": "sherblot"
		},
		"php": {
			"title": "PHP",
			"require": "clike",
			"owner": "milesj"
		},
		"php-extras": {
			"title": "PHP Extras",
			"require": "php",
			"owner": "milesj"
		},
		"coffeescript": {
			"title": "CoffeeScript",
			"require": "javascript",
			"owner": "R-osey"
		},
		"scss": {
			"title": "Sass (Scss)",
			"require": "css",
			"owner": "MoOx"
		},
		"bash": {
			"title": "Bash",
			"require": "clike",
			"owner": "zeitgeist87"
		},
		"c": {
			"title": "C",
			"require": "clike",
			"owner": "zeitgeist87"
		},
		"cpp": {
			"title": "C++",
			"require": "c",
			"owner": "zeitgeist87"
		},
		"python": {
			"title": "Python",
			"owner": "multipetros"
		},
		"sql": {
			"title": "SQL",
			"owner": "multipetros"
		},
		"groovy": {
			"title": "Groovy",
			"require": "clike",
			"owner": "robfletcher"
		},
		"http": {
			"title": "HTTP",
			"owner": "danielgtaylor"
		},
		"ruby": {
			"title": "Ruby",
			"require": "clike",
			"owner": "samflores"
		},
		"rip": {
			"title": "Rip",
			"owner": "ravinggenius"
		},
		"gherkin": {
			"title": "Gherkin",
			"owner": "mvalipour"
		},
		"csharp": {
			"title": "C#",
			"require": "clike",
			"owner": "mvalipour"
		},
		"go": {
			"title": "Go",
			"require": "clike",
			"owner": "arnehormann"
		},
		"nsis": {
			"title": "NSIS",
			"owner": "idleberg"
		},
		"aspnet": {
			"title": "ASP.NET (C#)",
			"require": "markup",
			"owner": "nauzilus"
		},
		"scala": {
			"title": "Scala",
			"require": "java",
			"owner": "jozic"
		},
		"haskell": {
			"title": "Haskell",
			"owner": "bholst"
		},
		"swift": {
			"title": "Swift",
			"require": "clike",
			"owner": "chrischares"
		},
		"objectivec": {
			"title": "Objective-C",
			"require": "c",
			"owner": "uranusjr"
		},
		"autohotkey": {
			"title": "AutoHotkey",
			"owner": "aviaryan"
		},
		"ini": {
			"title": "Ini",
			"owner": "aviaryan"
		},
		"latex": {
			"title": "LaTeX",
			"owner": "japborst"
		},
		"apacheconf": {
			"title": "Apache Configuration",
			"owner": "GuiTeK"
		},
		"git": {
			"title": "Git",
			"owner": "lgiraudel"
		},
	        "scheme" : {
		        "title": "Scheme",
		        "owner" : "bacchus123"
	        }
	},
	"plugins": {
		"meta": {
			"path": "plugins/{id}/prism-{id}",
			"link": "plugins/{id}/"
		},
		"line-highlight": "Line Highlight",
		"line-numbers": {
			"title": "Line Numbers",
			"owner": "kuba-kubula"
		},
		"show-invisibles": "Show Invisibles",
		"autolinker": "Autolinker",
		"wpd": "WebPlatform Docs",
		"file-highlight": {
			"title": "File Highlight",
			"noCSS": true
		},
		"show-language": {
			"title": "Show Language",
			"owner": "nauzilus"
		}
	}
};
