---
title: Show Language
description: Display the highlighted language in code blocks (inline code does not show the label).
owner: nauzilus
require: toolbar
noCSS: true
resources:
  - ../toolbar/prism-toolbar.css
  - ../toolbar/prism-toolbar.js
---

<section>

# Examples

## JavaScript

<pre data-src="./prism-show-language.js"></pre>

## CSS

<pre data-src="../toolbar/prism-toolbar.css"></pre>

## HTML (Markup)

<pre data-src="./index.html"></pre>

## SVG

The `data-language`{ .language-markup } attribute can be used to display a specific label whether it has been defined as a language or not.

<pre data-language="SVG v1.1" data-src="https://prismjs.com/assets/logo.svg"></pre>

## Plain text

```none
Just some text (aka. not code).
```

</section>
