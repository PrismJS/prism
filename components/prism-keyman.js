Prism.languages.keyman = {
	'comment': /\b[cC]\s.*?(\r?\n|$)/,
	'function': /\[\s*((CTRL|SHIFT|ALT|LCTRL|RCTRL|LALT|RALT)\s+)*(([T|K|U]_[a-z0-9_]+)|(".+")|('.+'))\s*\]/i,  // virtual key
	'string': /("|')((?!\1).)*\1/,
	'keyword': /\b(any|beep|call|context|deadkey|dk|if|index|notany|nul|outs|return|reset|save|set|store|use)\b/i,  // rule keywords
	'atrule': /\b(ansi|begin|unicode|group|(using keys))\b/i,   // structural keywords
	'bold': [   // header statements
		/\&(baselayout|bitmap|capsononly|capsalwaysoff|shiftfreescaps|copyright|ethnologuecode|hotkey|includecodes|keyboardversion|kmw_embedcss|kmw_embdjs|kmw_helpfile|kmw_helptext|kmw_rtl|language|layer|layoutfile|message|mnemoniclayout|name|oldcharposmatching|platform|targets|version|visualkeyboard|windowslanguages)\b/i,
		/\b(bitmap|bitmaps|(caps on only)|(caps always off)|(shift frees caps)|copyright|hotkey|language|layout|message|name|version)\b/i
	],
	'number': /\b(([uU]\+[\dA-Fa-f]+)|([dD]\d+)|([xX][\dA-Fa-f]+)|([0-7]+))\b/, // U+####, x###, d### characters and numbers
	'operator': /[+>\\,\(\)]/,
	'tag': /\$(keyman|kmfl|silkey|keymanweb|keymanonly):/i   // prefixes
};