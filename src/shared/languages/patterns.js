// Templating languages strip their expressions before markup sees the tag,
// so `width={{ w }} height={{ h }}>` arrives as `width= height=>`.
// An empty value before `>` is HTML's missing-attribute-value.
// An empty value before another `name=` is not HTML: it serves stripped templates only.
export const MARKUP_TAG =
	/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>])|(?=>|[^\s'">=]+=))|(?=[\s/>])))+)?\s*\/?>/;

export const JS_TEMPLATE_INTERPOLATION = /\$\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/;
export const JS_TEMPLATE = RegExp(
	/`(?:\\[\s\S]|<i>|[^\\`$]|\$(?!\{))*`/.source.replace(
		'<i>',
		() => JS_TEMPLATE_INTERPOLATION.source
	)
);
