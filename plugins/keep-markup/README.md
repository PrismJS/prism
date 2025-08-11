---
title: Keep Markup
description: Prevents custom markup from being dropped out during highlighting.
owner: Golmote
optional: normalize-whitespace
noCSS: true
---

<style>
	:where(pre, code)[class*="language-"] mark {
		display: inline-block;
		color: inherit;
		border: 1px solid #000;
		box-shadow: 0 0 2px #fff;
		padding: 1px;
		background: rgb(0 0 0 / .2);
	}
</style>

<section class="language-none">

# How to use

You have nothing to do. The plugin is active by default. With this plugin loaded, all markup inside code will be kept.

However, you can deactivate the plugin for certain code element by adding the `no-keep-markup` class to it. You can also deactivate the plugin for the whole page by adding the `no-keep-markup` class to the body of the page and then selectively activate it again by adding the `keep-markup` class to code elements.

## Double highlighting

Some plugins (e.g. [Autoloader](../autoloader)) need to re-highlight code blocks. This is a problem for Keep Markup because it will keep the markup of the first highlighting pass resulting in a lot of unnecessary DOM nodes and causing problems for themes and other plugins.

This problem can be fixed by adding a `drop-tokens` class to a code block or any of its ancestors. If `drop-tokens` is present, Keep Markup will ignore all `span.token`{ .language-css } elements created by Prism.

</section>

<section class="language-none">

# Examples

The following source code

```html
<pre><code class="language-css">
@media <mark>screen</mark> {
	div {
		<mark>text</mark>-decoration: <mark><mark>under</mark>line</mark>;
		back<mark>ground: url</mark>('foo.png');
	}
}</code></pre>
```

would render like this:

<pre><code class="language-css">
@media <mark>screen</mark> {
	div {
		<mark>text</mark>-decoration: <mark><mark>under</mark>line</mark>;
		back<mark>ground: url</mark>('foo.png');
	}
}</code></pre>

<p>
	It also works for inline code:
	<code class="language-javascript">v<mark>ar b</mark>ar = <mark>func</mark>tion () { <mark>/*</mark> foo <mark>*</mark>/ };</code>
</p>

</section>
