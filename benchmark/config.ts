export interface Config {
	options: ConfigOptions;
	remotes: ConfigRemote[];
	cases: Record<string, ConfigCase>;
}

export interface ConfigOptions {
	testFunction: 'tokenize' | 'highlight';
	/**
	 * in seconds
	 */
	maxTime: number;
	/**
	 * An optional comma separated list of languages than, if defined, will be the only languages for which the
	 * benchmark will be run
	 */
	language?: string;
	/**
	 * Whether the benchmark will only run with remotes. If `true`, the local project will be ignored
	 *
	 * @default false
	 */
	remotesOnly?: boolean;
}

export interface ConfigRemote {
	repo: string;
	/**
	 * @default 'master'
	 */
	branch?: string;
}

export interface ConfigCase {
	extends?: string | string[];
	files?: string | string[];
}

export const config: Config = {
	options: {
		testFunction: 'tokenize',
		maxTime: 3,
		remotesOnly: false
	},

	remotes: [
		/**
		 * This will checkout a specific branch from a given repo.
		 *
		 * If no branch is specified, the master branch will be used.
		 */

		{
			repo: 'https://github.com/PrismJS/prism.git'
		},
		/*{
			repo: 'https://github.com/<Your user name>/prism.git',
			branch: 'some-brach-you-want-to-test'
		},*/
	],

	cases: {
		'css': {
			files: [
				'../website/assets/style.css'
			]
		},
		'css!+css-extras': { extends: 'css' },
		'javascript': {
			extends: 'json',
			files: [
				'https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/prism.js',
				'https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/prism.min.js',
				'https://code.jquery.com/jquery-3.4.1.js',
				'https://code.jquery.com/jquery-3.4.1.min.js',
				'../website/assets/vendor/utopia.js'
			]
		},
		'json': {
			files: [
				'../src/components.json',
				'../package-lock.json'
			]
		},
		'markup': {
			files: [
				'../website/download.html',
				'../website/index.html',
				'https://github.com/PrismJS/prism', // the PrismJS/prism GitHub page
			]
		},
		'markup!+css+javascript': { extends: 'markup' },
		'c': {
			files: [
				'https://raw.githubusercontent.com/git/git/master/remote.h',
				'https://raw.githubusercontent.com/git/git/master/remote.c',
				'https://raw.githubusercontent.com/git/git/master/mergesort.c',
				'https://raw.githubusercontent.com/git/git/master/mergesort.h'
			]
		},
		'ruby': {
			files: [
				'https://raw.githubusercontent.com/rails/rails/master/actionview/lib/action_view/base.rb',
				'https://raw.githubusercontent.com/rails/rails/master/actionview/lib/action_view/layouts.rb',
				'https://raw.githubusercontent.com/rails/rails/master/actionview/lib/action_view/template.rb',
			]
		},
		'rust': {
			files: [
				'https://raw.githubusercontent.com/rust-lang/regex/master/src/utf8.rs',
				'https://raw.githubusercontent.com/rust-lang/regex/master/src/compile.rs',
				'https://raw.githubusercontent.com/rust-lang/regex/master/src/lib.rs'
			]
		}
	}
};
