// http://avisynth.nl/index.php/The_full_AviSynth_grammar
(function (Prism) {

	function toAlternation(words) {
		return words.reduce(function (acc, cur) {
			return cat(acc, cur.trim().replace(/ /g, '|'));
		}, '');
	}

	function cat(left, right) {
		return left + (left == '' ? '' : '|') + right;
	}

	function replace(pattern, replacements) {
		return pattern.replace(/<<(\d+)>>/g, function (m, index) {
			return replacements[+index];
		});
	}

	function re(pattern, replacements, flags) {
		return RegExp(replace(pattern, replacements), flags || '');
	}

	var wordLists = {
		types: 'clip int float string bool val',
		keywords: 'function global return try catch if else while for __END__', // includes avs+ native gscript constructs
		predefined: 'DEFAULT_MT_MODE (?:SCRIPT|MAINSCRIPT|PROGRAM)DIR (?:USER|MACHINE)_(?:PLUS|CLASSIC)_PLUGINS',
		constants: 'MT_(?:NICE_FILTER|MULTI_INSTANCE|SERIALIZED|SPECIAL_MT)',
		internals: {
			bools: 'is(?:bool|clip|float|int|string) defined (?:var|(?:internal)?function)?exists?',
			control: 'apply assert default eval import select nop undefined',
			global: 'set(?:memorymax|cachemode|maxcpu|workingdir|planarlegacyalignment) opt_(?:allowfloataudio|usewaveextensible|dwchannelmask|avipadscanlines|vdubplanarhack|enable_(?:v210|y3_10_10|y3_10_16|b64a|planartopackedrgb))',
			conv: 'hex(?:value)? value',
			numeric: 'max min muldiv floor ceil round fmod pi exp log(?:10)? pow sqrt abs sign frac rand spline continued(?:numerator|denominator)?',
			trig: 'a?sinh? a?cosh? a?tan[2h]?',
			bit: '(?:bit(?:and|not|x?or|[lr]?shift[aslu]?|sh[lr]|sa[lr]|[lr]rotatel?|ro[rl]|te?st|set(?:count)?|cl(?:ea)?r|ch(?:an)?ge?))',
			runtime: 'average(?:luma|chroma[uv]|[bgr]) (?:luma|chroma[uv]|rgb|[rgb]|[yuv](?=difference(?:fromprevious|tonext)))difference(?:fromprevious|tonext)? [yuvrgb]plane(?:median|min|max|minmaxdifference)',
			script: 'script(?:name(?:utf8)?|file(?:utf8)?|dir(?:utf8)?) setlogparams logmsg getprocessinfo',
			string: '[lu]case str(?:toutf8|fromutf8|len|cmpi?) (?:rev|left|right|mid|find|replace|fill)str format trim(?:left|right|all) chr ord time',
			version: 'version(?:number|string) isversionorgreater',
			helper: 'buildpixeltype colorspacenametopixeltype',
			avsplus: 'setfiltermtmode prefetch addautoloaddir on(?:cpu|cuda)'
		},
		properties: {
			content: 'has(?:audio|video)',
			resolution: 'width height',
			framerate: 'frame(?:count|rate) framerate(?:numerator|denominator)',
			interlacing: 'is(?:field|frame)based getparity',
			colorformat: 'pixeltype is(?:planar(?:rgba?)?|interleaved|rgb(?:24|32|48|64)?|y(?:8|u(?:y2|va?))?|yv(?:12|16|24|411)|420|422|444|packedrgb) hasalpha componentsize numcomponents bitspercomponent',
			audio: 'audio(?:rate|duration|length(?:[fs]|lo|hi)?|channels|bits) isaudio(?:float|int)'
		},
		filters: {
			source: 'avi(?:file)?source opendmlsource directshowsource image(?:reader|source|sourceanim) segmented(?:avisource|directshowsource) wavsource',
			color: 'coloryuv convertto(?:RGB(?:24|32|48|64)|(?:planar)?RGBA?|Y8?|YV(?:12|16|24|411)|YUVA?(?:444|422|420|411)|YUY2) convertbacktoyuy2 fixluminance gr[ae]yscale invert levels limiter mergea?rgb merge(?:luma|chroma) rgbadjust show(?:red|green|blue|alpha) swapuv tweak [uv]toy8? ytouv',
			overlay: '(?:colorkey|reset)mask mask(?:hs)? layer merge overlay subtract',
			geometry: 'addborders crop(?:bottom)? flip(?:horizontal|vertical) letterbox (?:horizontal|vertical)?reduceby2 (?:bicubic|bilinear|blackman|gauss|lanczos|lanczos4|point|sinc|spline(?:16|36|64))resize skewrows turn(?:left|right|180)',
			pixel: 'blur sharpen generalconvolution (?:spatial|temporal)soften fixbrokenchromaupsampling',
			timeline: 'trim (?:un)?alignedsplice (?:assume|assumescaled|change|convert)FPS (?:delete|duplicate)frame dissolve fade(?:in|out|io)[02]? freezeframe interleave loop reverse select(?:even|odd|(?:range)?every)',
			interlace: 'assume(?:frame|field)based assume[bt]ff bob complementparity doubleweave peculiarblend pulldown separate(?:columns|rows|fields) swapfields weave(?:columns|rows)?',
			audio: 'amplify(?:db)? assumesamplerate audiodub(?:ex)? audiotrim convertaudioto(?:(?:8|16|24|32)bit|float) converttomono delayaudio ensurevbrmp3sync get(?:left|right)?channel kill(?:audio|video) mergechannels mixaudio monotostereo normalize resampleaudio supereq ssrc timestretch',
			conditional: 'conditional(?:filter|select|reader) frameevaluate scriptclip writefile(?:if|start|end)? animate applyrange tcp(?:server|source)',
			export: 'imagewriter',
			debug: 'subtitle blankclip blackness colorbars(?:hd)? compare dumpfiltergraph setgraphanalysis echo histogram info messageclip preroll showfiveversions show(?:framenumber|smpte|time) stack(?:horizontal|vertical) tone version'
		}
	};

	var types = toAlternation([wordLists.types]);
	var keywords = toAlternation([wordLists.keywords]);
	var predefined = toAlternation([wordLists.predefined]);
	var constants = toAlternation([wordLists.constants]);
	var properties = toAlternation(Object.values(wordLists.properties));
	var intfuncs = toAlternation(Object.values(wordLists.internals));
	var intfilters = toAlternation(Object.values(wordLists.filters));
	var internals = cat(intfuncs, cat(properties, intfilters));

	Prism.languages.avisynth = {

		'comment': [
			{	// Matches [* *] nestable block comments, but can not handle nested comments correctly (recursion)
				pattern: /(^|[^\\])\[\*[\s\S]*?(?:\*\]|$)/,
				lookbehind: true,
				greedy: true
			},
			{	// Matches /* */ block comments
				pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
				lookbehind: true,
				greedy: true
			},
			{	// Matches # comments
				pattern: /(^|[^\\$])#.*/,
				lookbehind: true,
				greedy: true
			}
		],

		// Handle before strings because optional arguments are surrounded by double quotes.
		'argument': {
			pattern: re(/\b(?:<<0>>)\s+("?)\w+\1/.source, [types], 'i'),
			inside: {
				'keyword': {
					pattern: re(/\b(?:<<0>>)\b/.source, [types], 'i')
				}
			}
		},

		'string': [
			{ // triple double-quoted
				pattern: /"""[\s\S]*?"""/i,
				greedy: true,
			},
			{ // single double-quoted
				pattern: /"(?:\\(?:\r\n|[\s\S])|(?!")[^\\\r\n])*"/,
				greedy: true,
				inside: {
					'constant': {
						pattern: re(/<<0>>/.source, [predefined]) // These *are* case-sensitive!
					}
				}
			}
		],

		// The special "last" variable that takes the value of the last implicitly returned clip.
		'variable': /\b(last)\b/i,

		'boolean': /\b(?:true|false|yes|no)\b/i,

		'keyword': {
			pattern: re(/((?:^|[\\{])\s*)(?:<<0>>)(?=\s+)/.source, [keywords], 'im'),
			lookbehind: true
		},

		'constant': re(/\b<<0>>\b/.source, [constants]),

		// AviSynth's internal functions and filters.
		'builtin': re(/\b(?:<<0>>)(?=\s*\()/.source, [internals], 'i'),

		'builtin':  [
			{ // AviSynth's internal clip properties.
				pattern: re(/(\b\.)(?:<<0>>)\b(?=[^\.])/.source, [properties], 'i'),
				lookbehind: true
			},
			{ // AviSynth's internal functions and filters, including properties used as functions.
				pattern: re(/\b(?:<<0>>)(?=\s*\()/.source, [internals], 'i')
			}
		],

		// External filters, and user-defined filters.
		'function': {
			pattern: /\b[a-z_]\w*(?=\s*\()/i,
			inside: {
				'keyword': { // type casts
					pattern: re(/\b(?:<<0>>)\b/.source, [types], 'i')
				}
			}
		},

		// Matches a \ as the first or last character on a line
		'line-continuation': {
			pattern: /(^\s*)\\|\\(?=\s*$)/m,
			lookbehind: true,
			alias: 'punctuation'
		},

		'operator': /\+\+?|!=?|<=?|>=?|==?|&&|\|\||\?|\*|\/|%|:/,

		'number': /\B\$(?:[\da-f]{6}|[\da-f]{8})\b|(?:(?:\b|\B-)\d+(?:\.\d*)?\b|\B\.\d+\b)/i,

		'punctuation': /[{};(),.]/
	}
}(Prism));

Prism.languages.avs = Prism.languages.avisynth