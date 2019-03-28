Prism.languages.javastacktrace = {

	// java.sql.SQLException: Violation of unique constraint MY_ENTITY_UK_1: duplicate value(s) for column(s) MY_COLUMN in statement [...]
	// Caused by: java.sql.SQLException: Violation of unique constraint MY_ENTITY_UK_1: duplicate value(s) for column(s) MY_COLUMN in statement [...]
	// Caused by: com.example.myproject.MyProjectServletException
	// Caused by: MidLevelException: LowLevelException
	// Suppressed: Resource$CloseFailException: Resource ID = 0
	'summary': {
		pattern: /^[\t ]*(?:(?:Caused by:|Suppressed:|Exception in thread "[^"]*")[\t ]+)?[\w$.]+(?:\:.*)?$/m,
		inside: {
			'keyword': {
				pattern: /^(\s*)(?:(?:Caused by|Suppressed)(?=:)|Exception in thread)/m,
				lookbehind: true
			},

			// the current thread if the summary starts with 'Exception in thread'
			'string': {
				pattern: /^(\s*)"[^"]*"/,
				lookbehind: true
			},
			'exceptions': {
				pattern: /^(:?\s*)[\w$.]+(?=:|$)/,
				lookbehind: true,
				inside: {
					'class-name': /[\w$]+(?=$|:)/,
					'namespace': /[a-z]\w*/,
					'punctuation': /[.:]/
				}
			},
			'message': {
				pattern: /(:\s*)\S.*/,
				lookbehind: true,
				alias: 'string'
			},
			'punctuation': /[:]/
		}
	},

	// at org.mortbay.jetty.servlet.ServletHandler$CachedChain.doFilter(ServletHandler.java:1166)
	// at org.hsqldb.jdbc.Util.throwError(Unknown Source) here could be some notes
	// at Util.<init>(Unknown Source)
	'stack-frame': {
		pattern: /^[\t ]*(at) [\w$.]+(?:<init>)?\(([^()]*\))/m,
		groups: {
			$1: 'keyword',
			$2: {
				'punctuation': /\)/,
				'source': [
					// (Main.java:15)
					// (Main.scala:15)
					{
						pattern: /(\w+.\w+)(:)(\d+)/,
						groups: {
							$1: 'file',
							$2: 'punctuation',
							$3: ['line-number', 'number']
						}
					},
					// (Unknown Source)
					// (Native Method)
					// (...something...)
					{
						pattern: /[^()]+/,
						inside: {
							'keyword': /^(?:Unknown Source|Native Method)$/
						}
					}
				]
			}
		},
		inside: {
			'class-name': /[\w$]+(?=\.(?:<init>|[\w$]+)\()/,
			'function': /(?:<init>|[\w$]+)(?=\()/,
			'namespace': /[a-z]\w*/,
			'punctuation': /[.()]/
		}
	},

	// ... 32 more
	// ... 32 common frames omitted
	'more': {
		pattern: /^[\t ]*(\.{3}) (\d+) ([a-z]+(?: [a-z]+)*)/m,
		groups: {
			$1: 'punctuation',
			$2: 'number',
			$3: 'keyword'
		}
	}

};
