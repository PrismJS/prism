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

With `<script type="text/plain">` (view source; only `</script>` needs escaping):

<script type="text/plain"><p>Example with <strong>unescaped</strong> markup</p>
</script>

With the HTML-comment method:

<pre><code><!--<p>Example with <strong>unescaped</strong> markup</p>--></code></pre>

</section>

<section class="language-markup">

# FAQ

Why not use the HTML `<template>` tag?

Because it is a PITA to get its `textContent` and needs to be pointlessly cloned. Feel free to implement it yourself and send a pull request though, if you are so inclined.

Can I use this inline?

Not out of the box, because I figured it’s more of a hassle to type `<script type="text/plain">` than escape the 1-2 `<` characters you need to escape in inline code. Also inline code is not as frequently copy-pasted, which was the major source of annoyance that got me to write this plugin.

</section>
