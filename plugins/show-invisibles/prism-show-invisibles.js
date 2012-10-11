(function(){

if (typeof Prism === 'undefined') {
	return;
}

for (var language in Prism.languages) {
	var tokens = Prism.languages[language];
	
	tokens.tab = /\t/g;
	tokens.lf = /\n/g;
	tokens.cr = /\r/g;
}

})();