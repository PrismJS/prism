---
title: Line Highlight
description: Highlights specific lines and/or line ranges.
owner: LeaVerou
resources:
  - ../line-numbers/prism-line-numbers.css
  - ../line-numbers/prism-line-numbers.js
---

<section class="language-markup">

# How to use

Obviously, this only works on code blocks (`<pre><code>`) and not for inline code.

You specify the lines to be highlighted through the `data-line` attribute on the `<pre>` element, in the following simple format:

- A single number refers to the line with that number
- Ranges are denoted by two numbers, separated with a hyphen (-)
- Multiple line numbers or ranges are separated by commas.
- Whitespace is allowed anywhere and will be stripped off.

Examples:

5

: The 5th line

1-5

: Lines 1 through 5

1,4

: Line 1 and line 4

1-2, 5, 9-20

: Lines 1 through 2, line 5, lines 9 through 20

In case you want the line numbering to be offset by a certain number (for example, you want the 1st line to be number 41 instead of 1, which is an offset of 40), you can additionally use the `data-line-offset` attribute.

You can also link to specific lines on any code snippet, by using the following as a url hash: `#{element-id}.{lines}` where `{element-id}` is the id of the `<pre>` element and `{lines}` is one or more lines or line ranges that follow the format outlined above. For example, if there is an element with `id="play"` on the page, you can link to lines 5-6 by linking to [#play.5-6](#play.5-6)

If line numbers are also enabled for a code block and the `<pre>` element has an id, you can add the `linkable-line-numbers` class to the `<pre>` element. This will make all line numbers clickable and when clicking any line number, it will change the hash of the current page to link to that specific line.

</section>

<section>

# Examples

## Line 2

<pre data-line="2" data-src="./prism-line-highlight.js" id="play"></pre>

## Lines 15-25

<pre data-line="15-25" data-src="./prism-line-highlight.js"></pre>

## Line 1 and lines 3-4 and line 42

<pre data-line="1,3-4,42" data-src="./prism-line-highlight.js"></pre>

## Line 43, starting from line 41

<pre data-line="43" data-line-offset="40" data-src="./prism-line-highlight.js"></pre>

[Linking example](#play.50-55,60)

## Compatible with [Line numbers](../line-numbers)

<pre class="line-numbers" data-src="../line-numbers/index.html" data-line="1" data-start="-5" style="white-space: pre-wrap"></pre>

Even with some extra content before the `code` element.

<pre class="line-numbers" data-line="7"><div style="padding: .25em">Some content</div><hr/><code class="language-markup" id="foo"></code></pre>
<script>document.querySelector("#foo").textContent = document.documentElement.innerHTML;</script>

## With linkable line numbers

<pre id="linkable" class="line-numbers linkable-line-numbers" data-start="20" data-src="./prism-line-highlight.js"></pre>

</section>
