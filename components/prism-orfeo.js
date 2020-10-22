(function (Prism) {
	Prism.languages.orfeo = {
		'parenthesis-open': {
			pattern: /(^|[(^\s])\((?=[^.]|$)/,
			alias: 'punctuation',
			lookbehind: true
		},
		'parenthesis-close': {
			pattern: /(^|[^^])\)(?=[).\s]|$)/,
			alias: 'punctuation',
			lookbehind: true
		},
		'duration': {
			pattern: /(^|[(\s]):(?:=|(?:\.\d+|(?:0|[1-9]\d*)(?:\.\d*)?)(?:\/(?:0?\.0*[1-9]\d*|[1-9]\d*(?:\.\d*)?))?)(?=[)\s]|$)/,
			alias: 'number',
			lookbehind: true
		},
		'datum-quoted': {
			pattern: /(^|[(^\s])"[^"]*"(?=[).\s]|$)/,
			alias: 'string',
			lookbehind: true
		},
		'datum-unquoted': {
			pattern: /(^|[(^\s])[.\w/\[\]♮♭♯-]*[\w/\[\]♮♭♯-](?=[).\s]|$)/,
			alias: 'string',
			lookbehind: true
		},
		'rhythm-flags': {
			pattern: /(^|[(\s])\^+(?=\(|"[^"]*"|[.\w/\[\]♮♭♯-]*[\w/\[\]♮♭♯-]|$)/,
			alias: 'operator',
			lookbehind: true
		},
		'rhythm-dots': {
			pattern: /(^|[)"\w/\[\]♮♭♯-])\.+(?=[)\s]|$)/,
			alias: 'operator',
			lookbehind: true
		},
	}
}(Prism))
/* -----------------------------------------------------------------------------
	Orfeo v0.1.0

	Token Syntax

		parenthesis-open:  (
		parenthesis-close: )
		duration:          :=
		                   :<nonnegative int/float>
		                   :<nonnegative int/float>/<positive int/float>
		datum-quoted:      "<anything except ">"
		datum-unquoted:    [.\w/\[\]♮♭♯-] (one or many, but cannot end with period)
		rhythm-flags:      ^ (one or many)
		rhythm-dots:       . (one or many)

	Token Spacing

		Spaces Required In-Between

			[parenthesis-close] [parenthesis-open] ) (
			[parenthesis-close] [datum]            ) "a"       ) a
			[parenthesis-close] [rhythm-flags]     ) ^
			[duration] [parenthesis-open]          :4 (
			[duration] [datum]                     :4 "a"      :4 a
			[duration] [rhythm-flags]              :4 ^
			[datum] [parenthesis-open]             "a" (       a (
			[datum] [datum]                        "a" "a"     "a" a     a "a"     a a
			[datum] [rhythm-flags]                 "a" ^       a ^
			[rhythm-dots] [parenthesis-open]       . (
			[rhythm-dots] [datum]                  . "a"       . a
			[rhythm-dots] [rhythm-flags]           . ^

		No Spaces Allowed In-Between

			[rhythm-flags] and [rhythm-dots] cannot be used alone

			[parenthesis-close][rhythm-dots]       ).
			[datum][rhythm-dots]                   "a".        a.
			[rhythm-flags][parenthesis-open]       ^(
			[rhythm-flags][datum]                  ^"a"        ^a

		Known Issues

		[rhythm-flags] still get colored when followed by an incomplete [datum-quoted]
		It looks like the variable length lookahead in [rhythm-flags] is not working.
		^^^"datum (nothing should be colored, but [rhythm-flags] are)
--------------------------------------------------------------------------------
	Copyright (c) 2019-2020, Pierre-Emmanuel Lévesque
	License: MIT
----------------------------------------------------------------------------- */
