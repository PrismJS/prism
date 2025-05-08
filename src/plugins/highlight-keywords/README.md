---
title: Highlight Keywords
description: Adds special CSS classes for each keyword for fine-grained highlighting.
owner: vkbansal
noCSS: true
---

<style>
	/*
	 * Custom keyword styles
	 */
	.token.keyword.keyword-return, .token.keyword.keyword-if {
		/* Set the color to a nice red. */
		color: #f92672;
	}
</style>

<section class="language-none">

# How to use

This plugin adds a special class for every keyword, so keyword-specific styles can be applied. These special classes allow for fine-grained control over the appearance of keywords using your own CSS rules.

For example, the keyword `if` will have the class `keyword-if` added. A CSS rule used to apply special highlighting could look like this:

```css
.token.keyword.keyword-if { /* styles for 'if' */ }
```

**Note:** This plugin does not come with CSS styles. You have to define the keyword-specific CSS rules yourself.

</section>

<section class="language-none">

# Examples

This example shows the plugin in action. The keywords `if` and `return` will be highlighted in red. The color of all other keywords will be determined by the current theme. The CSS rules used to implement the keyword-specific highlighting can be seen in the HTML file below.

## JavaScript

<pre data-src="./prism-highlight-keywords.js"></pre>

## HTML (Markup)

<pre data-src="./index.html"></pre>

</section>
