(function (Prism) {
	Prism.languages.timeline = {
		'timepoint': {
			pattern: /(^\s*)(?:\.\d+|(?:0|[1-9]\d*)(?:\.\d*)?)(?=\s|$)/m,
			alias: 'number',
			lookbehind: true
		},
	}
}(Prism))
/* -----------------------------------------------------------------------------
	Timeline v0.1.0

	Token Syntax

		timepoint: <nonnegative int/float>

	Token Placement

		timepoint must be at the beginning of a line
--------------------------------------------------------------------------------
	Copyright (c) 2019-2020, Pierre-Emmanuel Lévesque
	License: MIT
----------------------------------------------------------------------------- */
