---
title: Line Numbers
description: Line number at the beginning of code lines.
owner: kuba-kubula
---

<section class="language-markup">

# How to use

Obviously, this is supposed to work only for code blocks (`<pre><code>`) and not for inline code.

Add the `line-numbers` class to your desired `<pre>` or any of its ancestors, and the Line Numbers plugin will take care of the rest. To give all code blocks line numbers, add the `line-numbers` class to the `<body>` of the page. This is part of a general activation mechanism where adding the `line-numbers` (or `no-line-numbers`) class to any element will enable (or disable) the Line Numbers plugin for all code blocks in that element.  
Example:

```html
<body class="line-numbers"> <!-- enabled for the whole page -->

	<!-- with line numbers -->
	<pre><code>...</code></pre>
	<!-- disabled for a specific element - without line numbers -->
	<pre class="no-line-numbers"><code>...</code></pre>

	<div class="no-line-numbers"> <!-- disabled for this subtree -->

		<!-- without line numbers -->
		<pre><code>...</code></pre>
		<!-- enabled for a specific element - with line numbers -->
		<pre class="line-numbers"><code>...</code></pre>

	</div>
</body>
```

Optional: You can specify the `data-start` (Number) attribute on the `<pre>` element. It will shift the line counter.

Optional: To support multiline line numbers using soft wrap, apply the CSS `white-space: pre-line;` or `white-space: pre-wrap;` to your desired `<pre>`.

</section>

<section class="line-numbers language-none">

# Examples

## JavaScript

<pre class="line-numbers" data-src="./prism-line-numbers.js"></pre>

## CSS

Please note that this `<pre>` does not have the `line-numbers` class but its parent does.

<pre data-src="./prism-line-numbers.css"></pre>

## HTML

Please note the `data-start="-5"` in the code below.

<pre class="line-numbers" data-src="./index.html" data-start="-5"></pre>

## Unknown languages

```{ .language-none .line-numbers }
This raw text
is not highlighted
but it still has
line numbers
```

## Soft wrap support

Please note the `style="white-space: pre-wrap;"` in the code below.

<pre class="line-numbers" data-src="./index.html" data-start="-5" style="white-space: pre-wrap;"></pre>

</section>
