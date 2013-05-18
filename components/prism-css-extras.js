Prism.languages.css.selector = {
	pattern: /[^\{\}\s][^\{\}]*(?=\s*\{)/ig,
	inside: {
		'pseudo': /::?[-a-z0-9\(\)+-]+/ig,
		'selector-class': /\.[-a-z0-9_:\.]+/ig,
		'selector-id': /#[-a-z0-9_:\.]+/ig
	}
};

Prism.languages.insertBefore('css', 'ignore', {
	'hexcode': /#[0-9a-f]{3,6}/gi,
	'number': /[0-9%\.]+/g,
	'function': /(attr|calc|cross-fade|cycle|element|hsl|hsla|image|lang|linear-gradient|matrix|matrix3d|perspective|radial-gradient|repeating-linear-gradient|repeating-radial-gradient|rgb|rgba|rotate|rotatex|rotatey|rotatez|rotate3d|scale|scalex|scaley|scalez|scale3d|skew|skewx|skewy|steps|translate|translatex|translatey|translatez|translate3d|url|var)/ig
});