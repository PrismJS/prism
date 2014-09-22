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
