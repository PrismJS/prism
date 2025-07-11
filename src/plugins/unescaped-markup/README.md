---
title: Unescaped Markup
description: Write markup without having to escape anything.
owner: LeaVerou
---

<section class="language-markup">

# How to use

This plugin provides several methods of achieving the same thing:

- Instead of using `<pre><code>` elements, use `<script type="text/plain">`:

```html
<script type="text/plain" class="language-markup">
<p>Example</p>
</script>
```

- Use an HTML-comment to escape your code:

```html
<pre class="language-markup"><code><!--
<p>Example</p>
--></code></pre>
```

This will only work if the `code` element contains exactly one comment and nothing else (not even spaces). E.g. `<code> <!-- some text --></code>` and `<code>text<!-- more text --></code>` will not work.

</section>

<section class="language-markup">

# Examples

View source to see that the following didn’t need escaping (except for <code>&lt;/script></code>, that does):

<script type="text/plain"><!DOCTYPE html>
<html lang="en">
<head>

	<meta charset="utf-8" />
	<link rel="icon" href="https://prismjs.com/assets/favicon.png" />
	<title>Keep markup ▲ Prism plugins</title>
	<base href=".." />
	<link rel="stylesheet" href="https://prismjs.com/assets/style.css" />
	<link rel="stylesheet" href="https://dev.prismjs.com/themes/prism.css" />

</head>
<body class="language-markup">

<header>
	<h2>Unescaped markup</h2>
	<p>Write markup without having to escape anything.</p>
</header>

<section>
	<h1>How to use</h1>
	<p>Instead of using <code>&lt;pre>&lt;code></code> elements, use <code>&lt;script type="text/plain"></code>:</p>
</section>

<section>
	<h1>FAQ</h1>

	<p>Why not use the HTML <code>&lt;template></code> tag?</p>

	<p>Because it is a PITA to get its <code>textContent</code> and needs to be pointlessly cloned.
		Feel free to implement it yourself and send a pull request though, if you are so inclined.</p>

	<p>Can I use this inline?</p>

	<p>Not out of the box, because I figured it’s more of a hassle to type <code>&lt;script type="text/plain"></code> than escape the 1-2 <code>&lt;</code> characters you need to escape in inline code.
	Also inline code is not as frequently copy-pasted, which was the major source of annoyance that got me to write this plugin.</p>
</section>

<section>
	<h1>Examples</h1>

	<p>With <code>&lt;script type="text/plain"></code>:</p>

	<script type="text/plain"><div><span>Foo</span></div>&lt;/script>
</section>

<script src="https://dev.prismjs.com/prism.js">&lt;/script>
<script src="unescaped-markup/prism-unescaped-markup.js">&lt;/script>

</body>
</html></script>

<p>The next example uses the HTML-comment method:</p>

<pre><code><!--<!DOCTYPE html>
<html lang="en">
<head>

	<meta charset="utf-8" />
	<link rel="icon" href="https://prismjs.com/assets/favicon.png" />
	<title>Keep markup ▲ Prism plugins</title>
	<base href=".." />
	<link rel="stylesheet" href="https://prismjs.com/assets/style.css" />
	<link rel="stylesheet" href="https://dev.prismjs.com/themes/prism.css" />

</head>
<body class="language-markup">

<header>
	<h2>Unescaped markup</h2>
	<p>Write markup without having to escape anything.</p>
</header>

<section>
	<h1>How to use</h1>
	<p>Instead of using <code>&lt;pre>&lt;code></code> elements, use <code>&lt;script type="text/plain"></code>:</p>
</section>

<section>
	<h1>FAQ</h1>

	<p>Why not use the HTML <code>&lt;template></code> tag?</p>

	<p>Because it is a PITA to get its <code>textContent</code> and needs to be pointlessly cloned.
		Feel free to implement it yourself and send a pull request though, if you are so inclined.</p>

	<p>Can I use this inline?</p>

	<p>Not out of the box, because I figured it’s more of a hassle to type <code>&lt;script type="text/plain"></code> than escape the 1-2 <code>&lt;</code> characters you need to escape in inline code.
	Also inline code is not as frequently copy-pasted, which was the major source of annoyance that got me to write this plugin.</p>
</section>

<section>
	<h1>Examples</h1>

	<p>With <code>&lt;script type="text/plain"></code>:</p>

	<script type="text/plain"><div><span>Foo</span></div></script>
</section>

<script src="https://dev.prismjs.com/prism.js"></script>
<script src="unescaped-markup/prism-unescaped-markup.js"></script>

</body>
</html>--></code></pre>

</section>

<section class="language-markup">

# FAQ

Why not use the HTML `<template>` tag?

Because it is a PITA to get its `textContent` and needs to be pointlessly cloned. Feel free to implement it yourself and send a pull request though, if you are so inclined.

Can I use this inline?

Not out of the box, because I figured it’s more of a hassle to type `<script type="text/plain">` than escape the 1-2 `<` characters you need to escape in inline code. Also inline code is not as frequently copy-pasted, which was the major source of annoyance that got me to write this plugin.

</section>
