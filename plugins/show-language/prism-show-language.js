(function(){

if (typeof self === 'undefined' || !self.Prism || !self.document) {
	return;
}

// The languages map is built automatically with gulp
var Languages = /*languages_placeholder[*/{"css":"CSS","clike":"C-like","javascript":"JavaScript","actionscript":"ActionScript","apacheconf":"Apache Configuration","apl":"APL","applescript":"AppleScript","aspnet":"ASP.NET (C#)","autohotkey":"AutoHotkey","csharp":"C#","cpp":"C++","coffeescript":"CoffeeScript","css-extras":"CSS Extras","fsharp":"F#","http":"HTTP","latex":"LaTeX","lolcode":"LOLCODE","matlab":"MATLAB","nasm":"NASM","nsis":"NSIS","objectivec":"Objective-C","php":"PHP","php-extras":"PHP Extras","powershell":"PowerShell","jsx":"React JSX","rest":"reST (reStructuredText)","sas":"SAS","sass":"Sass (Sass)","scss":"Sass (Scss)","sql":"SQL","typescript":"TypeScript","vhdl":"VHDL","wiki":"Wiki markup","yaml":"YAML"}/*]*/;
Prism.hooks.add('before-highlight', function(env) {
	var pre = env.element.parentNode;
	if (!pre || !/pre/i.test(pre.nodeName)) {
		return;
	}
	var language = Languages[env.language] || (env.language.substring(0, 1).toUpperCase() + env.language.substring(1));
	pre.setAttribute('data-language', language);
});

})();
