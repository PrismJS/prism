var components = {
	core: {
		meta: {
			path: 'components/prism-core.js',
			option: 'mandatory'
		},
		'core': 'Core'
	},
	themes: {
		meta: {
			path: '{id}.css',
			link: 'index.html?theme={id}',
			exclusive: true
		},
		'prism': {
			title: 'Default',
			option: 'default'
		},
		'prism-dark': 'Dark',
		'prism-funky': 'Funky',
		'prism-okaidia': 'Okaidia',
		'prism-twilight': 'Twilight'
	},
	languages: {
		meta: {
			path: 'components/prism-{id}',
			noCSS: true
		},
		'markup': {
			title: 'Markup',
			option: 'default'
		},
		'css': {
			title: 'CSS',
			option: 'default'
		},
		'css-extras': {
			title: 'CSS Extras',
			require: 'css'
		},
		'clike': {
			title: 'C-like',
			option: 'default'
		},
		'javascript': {
			title: 'JavaScript',
			option: 'default',
			require: 'clike'
		},
		'java' : {
			title: 'Java',
			require: 'clike'
		},
		'php' : {
			title: 'PHP',
			require: 'clike'
		},
		'php-extras' : {
			title: 'PHP Extras',
			require: 'php'
		},
		'coffeescript': {
			title: 'CoffeeScript',
			require: 'javascript'
		},
		'scss': {
			title: 'Sass (Scss)',
			require: 'css'
		},
		'bash' : {
			title: 'Bash',
			require: 'clike'
		},
		'c': {
			title: 'C',
			require: 'clike'
		},
		'cpp': {
			title: 'C++',
			require: 'c'
		},
		'python': {
			title: 'Python'
		},
		'sql': {
			title: 'SQL'
		},
		'groovy': {
			title: 'Groovy',
			require: 'clike'
		},
		'http': {
			title: 'HTTP'
		}
	},
	plugins: {
		meta: {
			path: 'plugins/{id}/prism-{id}',
			link: 'plugins/{id}/'
		},
		'line-highlight': 'Line Highlight',
		'line-numbers': 'Line Numbers',
		'show-invisibles': 'Show Invisibles',
		'autolinker': 'Autolinker',
		'wpd': 'WebPlatform Docs',
		'file-highlight': {
			title: 'File Highlight',
			noCSS: true
		}
	}
};