module.exports = {
	process: function(config, done){

		build_Prism();
		build_Components();
		build_Plugins();

		done();
	}
};


var OUTPUT = '/lib/',
	DIR = __dirname + '/';

function build_Prism () {
	io.settings({
		extensions: {
			js: [ 'importer:read' ]
		}
	});

	saveJavascript(
		io.File.read(DIR + 'prism-lib.js'), '', 'prism.js'
	);
}
function build_Components () {
	var umd = io.File.read(DIR + 'extension-umd.js'),
		SKIP = [
			'.min.',
			'-core.',
			'-markup.',
			'-css.',
			'-clike.',
			'-javascript.'
		];

	io.glob.readFiles('components/*.js').forEach(function(file){
		if (!shouldSkip(file, SKIP)) 
			wrapJavascript(file, umd, 'components/');
	});
}
function build_Plugins () {
	var umd = io.File.read(DIR + 'extension-umd.js'),
		SKIP = [
			'.min.',
			'index.html'
		];
	io.glob.read('plugins/*').forEach(function(dir){
		if (dir instanceof io.Directory === false) return;

		var pluginName = dir.getName();

		dir.readFiles('*').files.forEach(function(file) {
			if (shouldSkip(file, SKIP)) return;
			if (file.uri.getName() !== 'prism-' + pluginName + '.js') {
				file.copyTo(OUTPUT + 'plugins/' + pluginName + '/');
				return;
			}

			wrapJavascript(file, umd, 'plugins/' + pluginName + '/');
		});
	})
}


function minify (source) {
	return require('uglify-js').minify(source, {fromString: true}).code;
}
function shouldSkip (file, patterns) {
	return patterns.some(function(pattern){
		return file.uri.file.indexOf(pattern) !== -1;
	});
}
function wrapJavascript(file, umdSource, outputDir) {
	logger.log('wrap', file.uri.file.bold);

	var source = umdSource.replace('//%SOURCE%', function() { 
		return file.read() 
	});

	saveJavascript(source, outputDir, file.uri.file);
}
function saveJavascript(source, outputDir, filename) {
	io.File.write(OUTPUT + outputDir + filename, source);
	io.File.write(OUTPUT + outputDir + filename.replace('.js', '.min.js'), minify(source), { skipHooks: true });
}