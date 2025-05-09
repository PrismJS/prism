---
title: Normalize Whitespace
description: Supports multiple operations to normalize whitespace in code blocks.
owner: zeitgeist87
optional: unescaped-markup
noCSS: true
body_classes: language-markup
resources: ../keep-markup/prism-keep-markup.js
---

<style type="text/css">
	:where(pre, code)[class*="language-"] mark {
		display: inline-block;
		color: inherit;
		background: none;
		border: 1px solid #000;
		box-shadow: 0 0 2px #fff;
		padding: 1px;
		background: rgb(0 0 0 / 0.2);
	}
</style>

<section>

# How to use

Obviously, this is supposed to work only for code blocks (`<pre><code>`) and not for inline code.

By default the plugin trims all leading and trailing whitespace of every code block. It also removes extra indents and trailing whitespace on every line.

The plugin can be disabled for a particular code block by adding the class `no-whitespace-normalization` to either the `<pre>` or `<code>` tag.

The default settings can be overridden with the `setDefaults()`{ .language-javascript } method like so:

```js
Prism.plugins.NormalizeWhitespace.setDefaults({
	"remove-trailing": true,
	"remove-indent": true,
	"left-trim": true,
	"right-trim": true,
	/*"break-lines": 80,
	"indent": 2,
	"remove-initial-line-feed": false,
	"tabs-to-spaces": 4,
	"spaces-to-tabs": 4*/
});
```

The following settings are available and can be set via the `data-[setting]` attribute on the `<pre>` element:

`remove-trailing`

: Removes trailing whitespace on all lines.

`remove-indent`

: If the whole code block is indented too much it removes the extra indent.

`left-trim`

: Removes all whitespace from the top of the code block.

`right-trim`

: Removes all whitespace from the bottom of the code block.

`break-lines`

: Simple way of breaking long lines at a certain length (default is 80 characters).

`indent`

: Adds a certain number of tabs to every line.

`remove-initial-line-feed`

: Less aggressive version of left-trim. It only removes a single line feed from the top of the code block.

`tabs-to-spaces`

: Converts all tabs to a certain number of spaces (default is 4 spaces).

`spaces-to-tabs`

: Converts a certain number of spaces to a tab (default is 4 spaces).

</section>

<section>

# Examples

The following example demonstrates the use of this plugin:

<pre data-src="./demo.html"></pre>

The result looks like this:

<pre class="language-javascript">

	<code>


		let example = {
			foo: true,

			bar: false
		};


		let
		there_is_a_very_very_very_very_long_line_it_can_break_it_for_you
		 = true;
		
		if 
		(there_is_a_very_very_very_very_long_line_it_can_break_it_for_you
		 === true) {
		};


	</code>

</pre>

It is also compatible with the [keep-markup](../keep-markup) plugin:

<pre><code class="language-css">


@media <mark>screen</mark> {
	div {
		<mark>text</mark>-decoration: <mark><mark>under</mark>line</mark>;
		back<mark>ground: url</mark>('foo.png');
	}
}</code></pre>

This plugin can also be used on the server or on the command line with Node.js:

```js
let Prism = require("prismjs");
let Normalizer = require("prismjs/plugins/normalize-whitespace/prism-normalize-whitespace");
// Create a new Normalizer object
let nw = new Normalizer({
	"remove-trailing": true,
	"remove-indent": true,
	"left-trim": true,
	"right-trim": true,
	/*"break-lines": 80,
	"indent": 2,
	"remove-initial-line-feed": false,
	"tabs-to-spaces": 4,
	"spaces-to-tabs": 4*/
});

// ..or use the default object from Prism
nw = Prism.plugins.NormalizeWhitespace;

// The code snippet you want to highlight, as a string
let code = "\t\t\tlet data = 1;    ";

// Removes leading and trailing whitespace
// and then indents by 1 tab
code = nw.normalize(code, {
	// Extra settings
	indent: 1
});

// Returns a highlighted HTML string
let html = Prism.highlight(code, Prism.languages.javascript);
```

</section>
