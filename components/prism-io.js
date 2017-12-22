Prism.languages.io = {
    'comment': [
        {
            pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
            lookbehind: true
        },
        {
            pattern: /(^|[^\\:])\/\/.*/,
            lookbehind: true
        },
        {
            pattern: /(^|[^\\:])#.*/,
            lookbehind: true
        }
    ],
    'string': [
        {
            pattern: /(")(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
            greedy: true
        },
        {
            pattern: /(""")"?[\s\S]+?"?\1/,
            greedy: true
        }
    ], 
    'class-name': {
        pattern: /\b(?:_*\p{Lu}+[\p{L}_0-9]*)\b/
    },
    'keyword': /\b(?:activate|activeCoroCount|asString|block|break|catch|clone|collectGarbage|compileString|continue|do|doFile|doMessage|doString|else|elseif|exit|for|foreach|forward|getSlot|getEnvironmentVariable|hasSlot|if|ifFalse|ifNil|ifNilEval|ifTrue|isActive|isNil|isResumable|list|message|method|parent|pass|pause|perform|performWithArgList|print|println|proto|raise|raiseResumable|removeSlot|resend|resume|schedulerSleepSeconds|self|sender|setSchedulerSleepSeconds|setSlot|shallowCopy|slotNames|super|system|then|thisBlock|thisContext|call|try|type|uniqueId|updateSlot|wait|while|write|yield)\b/,
    'type':/\b(?:Array|AudioDevice|AudioMixer|Block|Box|Buffer|CFunction|CGI|Color|Curses|DBM|DNSResolver|DOConnection|DOProxy|DOServer|Date|Directory|Duration|DynLib|Error|Exception|FFT|File|Fnmatch|Font|Future|GL|GLE|GLScissor|GLU|GLUCylinder|GLUQuadric|GLUSphere|GLUT|Host|Image|Importer|LinkList|List|Lobby|Locals|MD5|MP3Decoder|MP3Encoder|Map|Message|Movie|Notification|Number|Object|OpenGL|Point|Protos|Regex|SGML|SGMLElement|SGMLParser|SQLite|Server|Sequence|ShowMessage|SleepyCat|SleepyCatCursor|Socket|SocketManager|Sound|Soup|Store|String|Tree|UDPSender|UPDReceiver|URL|User|Warning|WeakLink|true|false|nil|Random|BigNum|Sequence)\b/,
    'number': /\b-?(?:0x[\da-f]+|0o[0-7]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
    'operator': /:?:?=|==|\!=|\|\||&&?|>=?|<=?|\*\*?|\*=?|\/=?|%=?|\+=?|-=?|\^=?|>>=?|<<=?|return|and|or|not|@@?|\?\??|\.\./,
    'punctuation': /[{}[\];(),.:]/
};
