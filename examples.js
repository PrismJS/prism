/**
 * Manage examples
 */

(function() {

var cache = {};
var dependencies = {};

// TODO change treeURL before commit !
var treeURL = 'https://api.github.com/repos/Golmote/prism/git/trees/prism-examples?recursive=1';
var treePromise = new Promise(function(resolve) {
	$u.xhr({
		url: treeURL,
		callback: function(xhr) {
			if (xhr.status < 400) {
				resolve(JSON.parse(xhr.responseText).tree);
			}
		}
	});
});

var languages = components.languages;

for (var id in languages) {
	if(id === 'meta') {
		continue;
	}

	var language = languages[id];
	var checked = false;

	if (language.option === 'default') {
		checked = true;
	}

	language.enabled = checked;
	language.file = languages.meta.path.replace(/\{id}/g, id) + '.js';
	language.examples = languages.meta.examplesPath.replace(/\{id}/g, id) + '.html';

	if (language.require) {
		dependencies[language.require] = (dependencies[language.require] || []).concat(id);
	}

	fileExists(language.examples).then(function() {
		$u.element.create('label', {
			attributes: {
				'data-id': id
			},
			contents: [
				{
					tag: 'input',
					properties: {
						type: 'checkbox',
						name: 'language',
						value: id,
						checked: checked,
						onclick: (function (id) {
							return function () {
								$$('input[name="' + this.name + '"]').forEach(function (input) {
									languages[input.value].enabled = input.checked;
								});

								update(id);
							};
						}(id))
					}
				},
				language.title,
				language.owner ? {
					tag: 'a',
					properties: {
						href: 'http://github.com/' + language.owner,
						className: 'owner',
						target: '_blank'
					},
					contents: language.owner
				} : ' '
			],
			inside: '#languages'
		});
	});
}

function fileExists(filepath) {
	return treePromise.then(function(tree) {
		for(var i=0, l=tree.length; i<l; i++) {
			if(tree[i].path === filepath) {
				return true;
			}
		}
		throw 'File ' + filepath + ' does not exist';
	});
}

function update(id) {
	console.log('Update '+id);
}

}());