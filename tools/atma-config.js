module.exports = {
	'build': {
		action: 'custom',
		script: '/tools/build/builder.js'
	},
	'release': {
		action: 'custom',
		script: '/tools/release/process.js'
	},
	'watch': {
		files: 'components/**',
		config: '#[build]'
	},
	'default': [ 'build' ]
};