---
title: File Highlight
description: Fetch external files and highlight them with Prism. Used on the Prism website itself.
owner: LeaVerou
noCSS: true
resources:
  - ../line-numbers/prism-line-numbers.css
  - ../line-numbers/prism-line-numbers.js
---

<section class="language-markup">

# How to use

Use the `data-src` attribute on empty `<pre>` elements, like so:

```
<pre data-src="myfile.js"></pre>
```

You don’t need to specify the language, it’s automatically determined by the file extension. If, however, the language cannot be determined from the file extension or the file extension is incorrect, you may specify a language as well (with the usual class name way).

Use the `data-range` attribute to display only a selected range of lines from the file, like so:

```
<pre data-src="myfile.js" data-range="1,5"></pre>
```

Lines start at 1, so `"1,5"` will display line 1 up to and including line 5. It's also possible to specify just a single line (e.g. `"5"` for just line 5) and open ranges (e.g. `"3,"` for all lines starting at line 3). Negative integers can be used to specify the n-th last line, e.g. `-2` for the second last line.

When `data-range` is used in conjunction with the [Line Numbers plugin](../line-numbers), this plugin will add the proper `data-start` according to the specified range. This behavior can be overridden by setting the `data-start` attribute manually.

Please note that the files are fetched with XMLHttpRequest. This means that if the file is on a different origin, fetching it will fail, unless CORS is enabled on that website.

</section>

<section>

# Examples

The plugin’s JS code:

<pre data-src="./prism-file-highlight.js"></pre>

This page:

<pre data-src="./index.html"></pre>

File that doesn’t exist:

<pre data-src="foobar.js"></pre>

With line numbers, and `data-range="12,111"`:

<pre data-src="./prism-file-highlight.js" data-range="12,111" class="line-numbers"></pre>

For more examples, browse around the Prism website. Most large code samples are actually files fetched with this plugin.

</section>
