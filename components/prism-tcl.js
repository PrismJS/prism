Prism.languages.tcl = {
	'escaped': /\\./g,
	'comment': /#.*/g,
	'string': /"[^"]*"/g,
	'variable': [
		{
			pattern: /(\$)(::)?([a-zA-Z0-9]+::)*[a-zA-Z0-9_]+/g,
			lookbehind: true
		},
		{
			pattern: /(\$){[^}]+}/g,
			lookbehind: true
		},
		{
			pattern: /(^\s*set\s+)(::)?([a-zA-Z0-9]+::)*[a-zA-Z0-9_]+/gm,
			lookbehind: true
		}
	],
	'function': {
		lookbehind: true,
		pattern: /(^\s*proc\s+)[^\s]+/gm
	},
	'builtin': [
		{
			pattern: /(^\s*)(proc|return|class|error|eval|exit)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*)(for|foreach|if|switch|while|break|continue)\b/gm,
			lookbehind: true
		},
		/\b(elseif|else)\b/g
	],
	'scope': {
		pattern: /^\s+(global|upvar|variable)\b/gm,
		alias: 'constant'
	},
	'keyword': [
		{
			pattern: /(^\s*|\[)(after|append|apply|array|auto_execok|auto_import)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(auto_load|auto_mkindex|automkindex_old)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(auto_qualify|auto_reset|bgerror|binary|catch|cd)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(chan|clock|close|concat|dde|dict|encoding|eof)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(exec|exit|expr|fblocked|fconfigure|fcopy|file)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(fileevent|filename|flush|gets|glob|history)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(http|incr|info|interp|join|lappend|lassign)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(lindex|linsert|list|llength|load|lrange)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(lrepeat|lreplace|lreverse|lsearch|lset|lsort)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(mathfunc|mathop|memory|msgcat|namespace|open)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(package|parray|pid|pkg_mkIndex|platform|puts)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(pwd|re_syntax|read|refchan|regexp|registry)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(regsub|rename|Safe_Base|scan|seek|set|socket)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(source|split|string|subst|Tcl|tcl_endOfWord)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(tcl_findLibrary|tclStartOfNextWord)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(tclstartOfPreviousWord|tclwordBreakAfter)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(tclwordBreakBefore|tcltest|tclvars|tell|time)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(tm|trace|unknown|unload|unset|update|uplevel)\b/gm,
			lookbehind: true
		},
		{
			pattern: /(^\s*|\[)(upvar|variable|vwait)\b/gm,
			lookbehind: true
		}
	]
};
