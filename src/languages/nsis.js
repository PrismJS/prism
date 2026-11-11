/** @type {import('../types.d.ts').LanguageProto<'nsis'>} */
export default {
	id: 'nsis',
	grammar () {
		/**
		 * Original by Jan T. Sott (http://github.com/idleberg)
		 *
		 * Includes all commands and plug-ins shipped with NSIS 3.08
		 */
		return {
			'comment': {
				pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|[#;].*)/,
				lookbehind: true,
				greedy: true,
			},
			'string': {
				pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
				greedy: true,
			},
			'keyword': {
				pattern:
					/(^[\t ]*)(?:Abort|Add(?:BrandingImage|Size)|AdvSplash|Allow(?:RootDirInstall|SkipFiles)|AutoCloseWindow|BG(?:Font|Gradient|Image)|Banner|BrandingText|BringToFront|CPU|CRCCheck|Call(?:InstDLL)?|Caption|ChangeUI|CheckBitmap|ClearErrors|CompletedText|ComponentText|CopyFiles|Create(?:Directory|Font|ShortCut)|Delete(?:INISec|INIStr|RegKey|RegValue)?|Detail(?:Print|sButtonText)|Dialer|Dir(?:Text|Var|Verify)|EnableWindow|Enum(?:RegKey|RegValue)|Exch|Exec(?:Shell(?:Wait)?|Wait)?|ExpandEnvStrings|File(?:BufSize|Close|ErrorText|Open|Read|ReadByte|ReadUTF16LE|ReadWord|Seek|Write|WriteByte|WriteUTF16LE|WriteWord)?|Find(?:Close|First|Next|Window)|FlushINI|Function(?:End)?|Get(?:CurInstType|CurrentAddress|DLLVersion(?:Local)?|DlgItem|ErrorLevel|FileTime(?:Local)?|FullPathName|Function(?:Address|End)?|InstDirError|KnownFolderPath|LabelAddress|RegView|ShellVarContext|TempFileName|WinVer)|Goto|HideWindow|Icon|If(?:Abort|AltRegView|Errors|FileExists|RebootFlag|RtlLanguage|ShellVarContextAll|Silent)|InitPluginsDir|InstProgressFlags|Inst(?:Type(?:GetText|SetText)?)|Install(?:ButtonText|Colors|Dir(?:RegKey)?)|Int(?:64|Ptr)?CmpU?|Int(?:64)?Fmt|Int(?:Ptr)?Op|IsWindow|Lang(?:DLL|String)|License(?:BkColor|Data|ForceSelection|LangString|Text)|Load(?:AndSetImage|LanguageFile)|LockWindow|Log(?:Set|Text)|Manifest(?:AppendCustomString|DPIAware(?:ness)?|DisableWindowFiltering|GdiScaling|LongPathAware|MaxVersionTested|SupportedOS)|Math|MessageBox|MiscButtonText|NSISdl|Name|Nop|OutFile|PE(?:AddResource|DllCharacteristics|RemoveResource|SubsysVer)|Page(?:Callbacks|Ex(?:End)?)?|Pop|Push|Quit|RMDir|Read(?:EnvStr|INIStr|Memory|RegDWORD|RegStr)|Reboot|RegDLL|Rename|RequestExecutionLevel|ReserveFile|Return|SearchPath|Section(?:End|GetFlags|GetInstTypes|GetSize|GetText|Group(?:End)?|In(?:stType)?|SetFlags|SetInstTypes|SetSize|SetText)?|SendMessage|Set(?:AutoClose|BrandingImage|Compress(?:ionLevel|or(?:DictSize)?)?|CtlColors|CurInstType|DatablockOptimize|DateSave|Details(?:Print|View)|ErrorLevel|Errors|FileAttributes|Font|OutPath|Overwrite|PluginUnload|RebootFlag|RegView|ShellVarContext|Silent)|Show(?:InstDetails|UninstDetails|Window)|Silent(?:Install|UnInstall)|Sleep|SpaceTexts|Splash|StartMenu|Str(?:CmpS?|Cpy|Len)|SubCaption|System|Target|UnRegDLL|Unicode|UninstPage|Uninstall(?:ButtonText|Caption|Icon|SubCaption|Text)|UnsafeStrCpy|UserInfo|VI(?:AddVersionKey|FileVersion|ProductVersion)|VPatch|Var|WindowIcon|Write(?:INIStr|Reg(?:Bin|DWORD|ExpandStr|MultiStr|None|Str)|Uninstaller)|XPStyle|ns(?:Dialogs|Exec))\b/m,
				lookbehind: true,
			},
			'property':
				/\b(?:ARCHIVE|FILE_(?:ATTRIBUTE_ARCHIVE|ATTRIBUTE_HIDDEN|ATTRIBUTE_NORMAL|ATTRIBUTE_OFFLINE|ATTRIBUTE_READONLY|ATTRIBUTE_SYSTEM|ATTRIBUTE_TEMPORARY)|HIDDEN|HK(?:CC|(?:CR|CU|LM)(?:32|64)?|DD|PD|U)|HKEY_(?:CLASSES_ROOT|CURRENT_CONFIG|CURRENT_USER|DYN_DATA|LOCAL_MACHINE|PERFORMANCE_DATA|USERS)|ID(?:ABORT|CANCEL|D_(?:DIR|INST(?:FILES)?|LICENSE|SELCOM|UNINST|VERIFY)|IGNORE|NO|OK|RETRY|YES)|MB_(?:ABORTRETRYIGNORE|DEFBUTTON1|DEFBUTTON2|DEFBUTTON3|DEFBUTTON4|ICONEXCLAMATION|ICONINFORMATION|ICONQUESTION|ICONSTOP|OK|OKCANCEL|RETRYCANCEL|RIGHT|RTLREADING|SETFOREGROUND|TOPMOST|USERICON|YESNO(?:CANCEL)?)|NORMAL|OFFLINE|READONLY|SHCTX|SHELL_CONTEXT|SW_(?:HIDE|SHOW(?:DEFAULT|MAXIMIZED|MINIMIZED|NORMAL)?)|SYSTEM|TEMPORARY|Win(?:7|8|10|Vista)|admin|all|amd64-unicode|auto|both|bottom|bzip2|colored|components|current|custom|directory|false|force|hide|highest|ifdiff|ifnewer|instfiles|lastused|leave|left|license|listonly|lzma|nevershow|none|normal|notset|off|on|open|print|right|show|silent|silentlog|smooth|textonly|top|true|try|un\.(?:components|custom|directory|instfiles|license)|uninstConfirm|user|x86-(?:ansi|unicode)|zlib)\b/,
			'constant': /\$\{[!\w\.:\^-]+\}|\$\([!\w\.:\^-]+\)/,
			'variable': /\$\w[\w\.]*/,
			'number': /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
			'operator': /--?|\+\+?|<=?|>=?|==?=?|&&?|\|\|?|[?*\/~^%]/,
			'punctuation': /[{}[\];(),.:]/,
			'important': {
				pattern:
					/(^[\t ]*)!(?:addincludedir|addplugindir|appendfile|appendmemfile|assert|cd|define|delfile|echo|else|elseif|elseifdef|elseifmacrodef|elseifmacrondef|elseifndef|endif|error|execute|finalize|getdllversion|gettlbversion|if|ifdef|ifmacrodef|ifmacrondef|ifndef|include|insertmacro|macro|macroend|macroundef|makensis|packhdr|pragma|searchparse|searchreplace|system|tempfile|undef|uninstfinalize|verbose|warning)\b/im,
				lookbehind: true,
			},
		};
	},
};
