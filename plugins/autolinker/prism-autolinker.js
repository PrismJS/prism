(function(){

if (!window.Prism) {
	return;
}

var url = /\b([a-z]{3,7}:\/\/|tel:)\S+/g,
    email = /\b\S+@[\w.]+[a-z]{2}/g,
    candidates = ['comment', 'line-comment', 'url'];

Prism.hooks.add('wrap', function(env) {
	if (candidates.indexOf(env.type) > -1) {
		env.content = env.content
			.replace(url, '<a href="$&">$&</a>')
			.replace(email, '<a href="mailto:$&">$&</a>')
	}
});

})();