import { insertBefore } from '../util/insert-before';
import csharp from './csharp';
import markup from './markup';
import type { Grammar, GrammarToken, LanguageProto } from '../types';

export default {
	id: 'cshtml',
	require: [markup, csharp],
	alias: 'razor',
	grammar ({ extend }) {
		// Docs:
		// https://docs.microsoft.com/en-us/aspnet/core/razor-pages/?view=aspnetcore-5.0&tabs=visual-studio
		// https://docs.microsoft.com/en-us/aspnet/core/mvc/views/razor?view=aspnetcore-5.0

		const commentLike = /\/(?![/*])|\/\/.*[\r\n]|\/\*[^*]*(?:\*(?!\/)[^*]*)*\*\//.source;
		const stringLike =
			/@(?!")|"(?:[^\r\n\\"]|\\.)*"|@"(?:[^\\"]|""|\\[\s\S])*"(?!")/.source +
			'|' +
			/'(?:(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'|(?=[^\\](?!')))/.source;

		/**
		 * Creates a nested pattern where all occurrences of the string `<<self>>` are replaced with the pattern itself.
		 */
		function nested (pattern: string, depthLog2: number) {
			for (let i = 0; i < depthLog2; i++) {
				pattern = pattern.replace(/<self>/g, () => '(?:' + pattern + ')');
			}
			return pattern
				.replace(/<self>/g, '[^\\s\\S]')
				.replace(/<str>/g, '(?:' + stringLike + ')')
				.replace(/<comment>/g, '(?:' + commentLike + ')');
		}

		const round = nested(/\((?:[^()'"@/]|<str>|<comment>|<self>)*\)/.source, 2);
		const square = nested(/\[(?:[^\[\]'"@/]|<str>|<comment>|<self>)*\]/.source, 1);
		const curly = nested(/\{(?:[^{}'"@/]|<str>|<comment>|<self>)*\}/.source, 2);
		const angle = nested(/<(?:[^<>'"@/]|<comment>|<self>)*>/.source, 1);

		const inlineCs =
			/@/.source +
			/(?:await\b\s*)?/.source +
			'(?:' +
			/(?!await\b)\w+\b/.source +
			'|' +
			round +
			')' +
			'(?:' +
			/[?!]?\.\w+\b/.source +
			'|' +
			'(?:' +
			angle +
			')?' +
			round +
			'|' +
			square +
			')*' +
			/(?![?!\.(\[]|<(?!\/))/.source;

		// Note about the above bracket patterns:
		// They all ignore HTML expressions that might be in the C# code. This is a problem because HTML (like strings and
		// comments) is parsed differently. This is a huge problem because HTML might contain brackets and quotes which
		// messes up the bracket and string counting implemented by the above patterns.
		//
		// This problem is not fixable because 1) HTML expression are highly context sensitive and very difficult to detect
		// and 2) they require one capturing group at every nested level. See the `tagRegion` pattern to admire the
		// complexity of an HTML expression.
		//
		// To somewhat alleviate the problem a bit, the patterns for characters (e.g. 'a') is very permissive, it also
		// allows invalid characters to support HTML expressions like this: <p>That's it!</p>.

		const tagAttrInlineCs = /@(?![\w()])/.source + '|' + inlineCs;
		const tagAttrValue =
			'(?:' +
			/"[^"@]*"|'[^'@]*'|[^\s'"@>=]+(?=[\s>])/.source +
			'|' +
			'["\'][^"\'@]*(?:(?:' +
			tagAttrInlineCs +
			')[^"\'@]*)+["\']' +
			')';

		const tagAttrs =
			/(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*<tagAttrValue>|(?=[\s/>])))+)?/.source.replace(
				/<tagAttrValue>/,
				tagAttrValue
			);
		const tagContent = /(?!\d)[^\s>\/=$<%]+/.source + tagAttrs + /\s*\/?>/.source;
		const tagRegion =
			/\B@?/.source +
			'(?:' +
			/<([a-zA-Z][\w:]*)/.source +
			tagAttrs +
			/\s*>/.source +
			'(?:' +
			(/[^<]/.source +
				'|' +
				// all tags that are not the start tag
				// @ts-expect-error TS(2532): Ignore the non-existent capturing group error.
				/<\/?(?!\1\b)/.source + // eslint-disable-line regexp/strict
				tagContent +
				'|' +
				// nested start tag
				nested(
					// @ts-expect-error TS(2532): Ignore the non-existent capturing group error.
					/<\1/.source + // eslint-disable-line regexp/strict
						tagAttrs +
						/\s*>/.source +
						'(?:' +
						(/[^<]/.source +
							'|' +
							// all tags that are not the start tag
							// @ts-expect-error TS(2532): Ignore the non-existent capturing group error.
							/<\/?(?!\1\b)/.source + // eslint-disable-line regexp/strict
							tagContent +
							'|' +
							'<self>') +
						')*' +
						// @ts-expect-error TS(2532): Ignore the non-existent capturing group error.
						/<\/\1\s*>/.source, // eslint-disable-line regexp/strict
					2
				)) +
			')*' +
			// @ts-expect-error TS(2532): Ignore the non-existent capturing group error.
			/<\/\1\s*>/.source + // eslint-disable-line regexp/strict
			'|' +
			/</.source +
			tagContent +
			')';

		// Now for the actual language definition(s):
		//
		// Razor as a language has 2 parts:
		//  1) CSHTML: A markup-like language that has been extended with inline C# code expressions and blocks.
		//  2) C#+HTML: A variant of C# that can contain CSHTML tags as expressions.
		//
		// In the below code, both CSHTML and C#+HTML will be create as separate language definitions that reference each
		// other. However, only CSHTML will be exported via `Prism.languages`.

		const cshtml = extend('markup', {});

		const csharpWithHtml = extend('csharp', {});
		insertBefore(csharpWithHtml, 'string', {
			'html': {
				pattern: RegExp(tagRegion),
				greedy: true,
				inside: 'cshtml',
			},
		});

		const cs = {
			pattern: /\S[\s\S]*/,
			alias: 'language-csharp',
			inside: csharpWithHtml,
		};

		const inlineValue = {
			pattern: RegExp(/(^|[^@])/.source + inlineCs),
			lookbehind: true,
			greedy: true,
			alias: 'variable',
			inside: {
				'keyword': /^@/,
				'csharp': cs,
			},
		};

		const tag = cshtml.tag as GrammarToken;
		tag.pattern = RegExp(/<\/?/.source + tagContent);
		const attrValue = (tag.inside as Grammar)['attr-value'] as GrammarToken;
		attrValue.pattern = RegExp(/=\s*/.source + tagAttrValue);
		insertBefore(attrValue.inside as Grammar, 'punctuation', { 'value': inlineValue });

		insertBefore(cshtml, 'prolog', {
			'razor-comment': {
				pattern: /@\*[\s\S]*?\*@/,
				greedy: true,
				alias: 'comment',
			},

			'block': {
				pattern: RegExp(
					/(^|[^@])@/.source +
						'(?:' +
						[
							// @{ ... }
							curly,
							// @code{ ... }
							/(?:code|functions)\s*/.source + curly,
							// @for (...) { ... }
							/(?:for|foreach|lock|switch|using|while)\s*/.source +
								round +
								/\s*/.source +
								curly,
							// @do { ... } while (...);
							/do\s*/.source +
								curly +
								/\s*while\s*/.source +
								round +
								/(?:\s*;)?/.source,
							// @try { ... } catch (...) { ... } finally { ... }
							/try\s*/.source +
								curly +
								/\s*catch\s*/.source +
								round +
								/\s*/.source +
								curly +
								/\s*finally\s*/.source +
								curly,
							// @if (...) {...} else if (...) {...} else {...}
							/if\s*/.source +
								round +
								/\s*/.source +
								curly +
								'(?:' +
								/\s*else/.source +
								'(?:' +
								/\s+if\s*/.source +
								round +
								')?' +
								/\s*/.source +
								curly +
								')*',
							// @helper Ident(params) { ... }
							/helper\s+\w+\s*/.source + round + /\s*/.source + curly,
						].join('|') +
						')'
				),
				lookbehind: true,
				greedy: true,
				inside: {
					'keyword': /^@\w*/,
					'csharp': cs,
				},
			},

			'directive': {
				pattern:
					/^([ \t]*)@(?:addTagHelper|attribute|implements|inherits|inject|layout|model|namespace|page|preservewhitespace|removeTagHelper|section|tagHelperPrefix|using)(?=\s).*/m,
				lookbehind: true,
				greedy: true,
				inside: {
					'keyword': /^@\w+/,
					'csharp': cs,
				},
			},

			'value': inlineValue,

			'delegate-operator': {
				pattern: /(^|[^@])@(?=<)/,
				lookbehind: true,
				alias: 'operator',
			},
		});

		return cshtml;
	},
} as LanguageProto<'cshtml'>;
