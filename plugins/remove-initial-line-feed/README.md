---
title: Remove Initial Line Feed
description: Removes the initial line feed in code blocks.
owner: Golmote
noCSS: true
---

<section class="language-markup">

# How to use (DEPRECATED)

This plugin will be removed in the future. Please use the general purpose [Normalize Whitespace](/normalize-whitespace) plugin instead.

Obviously, this is supposed to work only for code blocks (`<pre><code>`) and not for inline code.

With this plugin included, any initial line feed will be removed by default.

To bypass this behavior, you may add the class `keep-initial-line-feed` to your desired `<pre>`.

</section>

<section>

# Examples

## Without adding the class

<pre class="language-markup"><code>
&lt;div>&lt;/div>
</code></pre>

## With the class added

<pre class="language-markup keep-initial-line-feed"><code>
&lt;div>&lt;/div>
</code></pre>

</section>
