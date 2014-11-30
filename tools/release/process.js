var Builder 	= require('../build/builder');
var BRANCH 		= 'builder';

module.exports = {
	process: function(config, done){
		
		app
			.findAction('release')
			.done(function(Release){
				
				// bump package.json and bower.json versions
				Release.bump(function(err, version){
							
					Release.runCommands([
						'git add -A',
						'git commit -a -m "v' + version + '"',
						'git push origin ' + BRANCH,
						'git checkout -B release',
						function (done) {
							Builder.process({}, done);
						},
						function () {
							Release.includeFiles.create([
								'lib/**',
								'themes/**',
								'README.md',
								'LICENSE',
								'package.json',
								'bower.json'
							]);
						},
						'git rm -r --cached .',
						'git add -A',
						'git commit -a -m "v' + version + '"',
						'git push origin release -ff',
						'git tag v' + version,
						'git push --tags',
						//'npm publish',
						function () {
						 	Release.includeFiles.reset();
						},
						'git checkout ' + BRANCH + ' -ff'
					], done);
				});
			
			});
	}
};