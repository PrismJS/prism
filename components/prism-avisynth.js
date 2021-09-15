// http://avisynth.nl/index.php/The_full_AviSynth_grammar
(function (Prism) {

	function replace(pattern, replacements) {
		return pattern.replace(/<<(\d+)>>/g, function (m, index) {
			return replacements[+index];
		});
	}

	function re(pattern, replacements, flags) {
		return RegExp(replace(pattern, replacements), flags || '');
	}

	var types = /clip|int|float|string|bool|val/.source;
	var internals = [
		// bools
		/is(?:bool|clip|float|int|string)|defined|(?:var|(?:internal)?function)?exists?/.source,
		// control
		/apply|assert|default|eval|import|select|nop|undefined/.source,
		// global
		/set(?:memorymax|cachemode|maxcpu|workingdir|planarlegacyalignment)|opt_(?:allowfloataudio|usewaveextensible|dwchannelmask|avipadscanlines|vdubplanarhack|enable_(?:v210|y3_10_10|y3_10_16|b64a|planartopackedrgb))/.source,
		// conv
		/hex(?:value)?|value/.source,
		// numeric
		/max|min|muldiv|floor|ceil|round|fmod|pi|exp|log(?:10)?|pow|sqrt|abs|sign|frac|rand|spline|continued(?:numerator|denominator)?/.source,
		// trig
		/a?sinh?|a?cosh?|a?tan[2h]?/.source,
		// bit
		/(?:bit(?:and|not|x?or|[lr]?shift[aslu]?|sh[lr]|sa[lr]|[lr]rotatel?|ro[rl]|te?st|set(?:count)?|cl(?:ea)?r|ch(?:an)?ge?))/.source,
		// runtime
		/average(?:luma|chroma[uv]|[bgr])|(?:luma|chroma[uv]|rgb|[rgb]|[yuv](?=difference(?:fromprevious|tonext)))difference(?:fromprevious|tonext)?|[yuvrgb]plane(?:median|min|max|minmaxdifference)/.source,
		// script
		/script(?:name(?:utf8)?|file(?:utf8)?|dir(?:utf8)?)|setlogparams|logmsg|getprocessinfo/.source,
		// string
		/[lu]case|str(?:toutf8|fromutf8|len|cmpi?)|(?:rev|left|right|mid|find|replace|fill)str|format|trim(?:left|right|all)|chr|ord|time/.source,
		// version
		/version(?:number|string)|isversionorgreater/.source,
		// helper
		/buildpixeltype|colorspacenametopixeltype/.source,
		// avsplus
		/setfiltermtmode|prefetch|addautoloaddir|on(?:cpu|cuda)/.source
	].join('|');
	var properties = [
		// content
		/has(?:audio|video)/.source,
		// resolution
		/width|height/.source,
		// framerate
		/frame(?:count|rate)|framerate(?:numerator|denominator)/.source,
		// interlacing
		/is(?:field|frame)based|getparity/.source,
		// color format
		/pixeltype|is(?:planar(?:rgba?)?|interleaved|rgb(?:24|32|48|64)?|y(?:8|u(?:y2|va?))?|yv(?:12|16|24|411)|420|422|444|packedrgb)|hasalpha|componentsize|numcomponents|bitspercomponent/.source,
		// audio
		/audio(?:rate|duration|length(?:[fs]|lo|hi)?|channels|bits)|isaudio(?:float|int)/.source
	].join('|');
	var filters = [
		// source
		/avi(?:file)?source|opendmlsource|directshowsource|image(?:reader|source|sourceanim)|segmented(?:avisource|directshowsource)|wavsource/.source,
		// color
		/coloryuv|convertto(?:RGB(?:24|32|48|64)|(?:planar)?RGBA?|Y8?|YV(?:12|16|24|411)|YUVA?(?:444|422|420|411)|YUY2)|convertbacktoyuy2|fixluminance|gr[ae]yscale|invert|levels|limiter|mergea?rgb|merge(?:luma|chroma)|rgbadjust|show(?:red|green|blue|alpha)|swapuv|tweak|[uv]toy8?|ytouv/.source,
		// overlay
		/(?:colorkey|reset)mask|mask(?:hs)?|layer|merge|overlay|subtract/.source,
		// geometry
		/addborders|crop(?:bottom)?|flip(?:horizontal|vertical)|letterbox|(?:horizontal|vertical)?reduceby2|(?:bicubic|bilinear|blackman|gauss|lanczos|lanczos4|point|sinc|spline(?:16|36|64))resize|skewrows|turn(?:left|right|180)/.source,
		// pixel
		/blur|sharpen|generalconvolution|(?:spatial|temporal)soften|fixbrokenchromaupsampling/.source,
		// timeline
		/trim|(?:un)?alignedsplice|(?:assume|assumescaled|change|convert)FPS|(?:delete|duplicate)frame|dissolve|fade(?:in|out|io)[02]?|freezeframe|interleave|loop|reverse|select(?:even|odd|(?:range)?every)/.source,
		// interlace
		/assume(?:frame|field)based|assume[bt]ff|bob|complementparity|doubleweave|peculiarblend|pulldown|separate(?:columns|rows|fields)|swapfields|weave(?:columns|rows)?/.source,
		// audio
		/amplify(?:db)?|assumesamplerate|audiodub(?:ex)?|audiotrim|convertaudioto(?:(?:8|16|24|32)bit|float)|converttomono|delayaudio|ensurevbrmp3sync|get(?:left|right)?channel|kill(?:audio|video)|mergechannels|mixaudio|monotostereo|normalize|resampleaudio|supereq|ssrc|timestretch/.source,
		// conditional
		/conditional(?:filter|select|reader)|frameevaluate|scriptclip|writefile(?:if|start|end)?|animate|applyrange|tcp(?:server|source)/.source,
		// export
		/imagewriter/.source,
		// debug
		/subtitle|blankclip|blackness|colorbars(?:hd)?|compare|dumpfiltergraph|setgraphanalysis|echo|histogram|info|messageclip|preroll|showfiveversions|show(?:framenumber|smpte|time)|stack(?:horizontal|vertical)|tone|version/.source
	].join('|');
	var allinternals = [internals, properties, filters].join('|');

	Prism.languages.avisynth = {
		'comment': [
			{
				// Matches [* *] nestable block comments, but only supports 1 level of nested comments
				// /\[\*(?:[^\[*]|\[(?!\*)|\*(?!\])|<self>)*\*\]/
				pattern: /(^|[^\\])\[\*(?:[^\[*]|\[(?!\*)|\*(?!\])|\[\*(?:[^\[*]|\[(?!\*)|\*(?!\]))*\*\])*\*\]/,
				lookbehind: true,
				greedy: true
			},
			{
				// Matches /* */ block comments
				pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
				lookbehind: true,
				greedy: true
			},
			{
				// Matches # comments
				pattern: /(^|[^\\$])#.*/,
				lookbehind: true,
				greedy: true
			}
		],

		// Handle before strings because optional arguments are surrounded by double quotes
		'argument': {
			pattern: re(/\b(?:<<0>>)\s+("?)\w+\1/.source, [types], 'i'),
			inside: {
				'keyword': /^\w+/
			}
		},

		// Optional argument assignment
		'argument-label': {
			pattern: /([,(][\s\\]*)\w+\s*=(?!=)/,
			lookbehind: true,
			inside: {
				'argument-name': {
					pattern: /^\w+/,
					alias: 'punctuation'
				},
				'punctuation': /=$/
			}
		},

		'string': [
			{
				// triple double-quoted
				pattern: /"""[\s\S]*?"""/,
				greedy: true,
			},
			{
				// single double-quoted
				pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
				greedy: true,
				inside: {
					'constant': {
						// These *are* case-sensitive!
						pattern: /\b(?:DEFAULT_MT_MODE|(?:SCRIPT|MAINSCRIPT|PROGRAM)DIR|(?:USER|MACHINE)_(?:PLUS|CLASSIC)_PLUGINS)\b/
					}
				}
			}
		],

		// The special "last" variable that takes the value of the last implicitly returned clip
		'variable': /\b(?:last)\b/i,

		'boolean': /\b(?:true|false|yes|no)\b/i,

		'keyword': /\b(?:function|global|return|try|catch|if|else|while|for|__END__)\b/i,

		'constant': /\bMT_(?:NICE_FILTER|MULTI_INSTANCE|SERIALIZED|SPECIAL_MT)\b/,

		// AviSynth's internal functions, filters, and properties
		'builtin-function': {
			pattern: re(/\b(?:<<0>>)\b/.source, [allinternals], 'i'),
			alias: 'function'
		},

		'type-cast': {
			pattern: re(/\b(?:<<0>>)(?=\s*\()/.source, [types], 'i'),
			alias: 'keyword'
		},

		// External/user-defined filters
		'function': {
			pattern: /\b[a-z_]\w*(?=\s*\()|(\.)[a-z_]\w*\b/i,
			lookbehind: true
		},

		// Matches a \ as the first or last character on a line
		'line-continuation': {
			pattern: /(^[ \t]*)\\|\\(?=[ \t]*$)/m,
			lookbehind: true,
			alias: 'punctuation'
		},

		'number': /\B\$(?:[\da-f]{6}|[\da-f]{8})\b|(?:(?:\b|\B-)\d+(?:\.\d*)?\b|\B\.\d+\b)/i,

		'operator': /\+\+?|[!=<>]=?|&&|\|\||[?:*/%-]/,

		'punctuation': /[{}\[\]();,.]/
	};

	Prism.languages.avs = Prism.languages.avisynth;

}(Prism));
