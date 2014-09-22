Prism.languages.css3 = Prism.languages.css;
Prism.languages.html5 = Prism.languages.html;
Prism.languages.php4 = Prism.languages.php;
Prism.languages.php5 = Prism.languages.php;
Prism.languages.php6 = Prism.languages.php;

(function(){

if (!self.Prism) {
	return;
}

var Languages = {
    'coffee': 'CoffeeScript',
    'coffeescript': 'CoffeeScript',
	'csharp': 'C#',
	'cpp': 'C++'
};
Prism.hooks.add('before-highlight', function(env) {
	var language = Languages[env.language] || env.language;
	env.element.setAttribute('data-language', language);
});

})();
