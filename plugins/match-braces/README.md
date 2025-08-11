---
title: Match braces
description: Highlights matching braces.
owner: RunDevelopment
resources: ../autoloader/prism-autoloader.js
---

<section class="language-markup">

# How to use

To enable this plugin add the `match-braces` class to a code block:

```html
<pre><code class="language-xxxx match-braces">...</pre></code>
```

Just like `language-xxxx`, the `match-braces` class is inherited, so you can add the class to the `<body>` to enable the plugin for the whole page.

The plugin will highlight brace pairs when the cursor hovers over one of the braces. The highlighting effect will disappear as soon as the cursor leaves the brace pair.  
The hover effect can be disabled by adding the `no-brace-hover` to the code block. This class can also be inherited.

You can also click on a brace to select the brace pair. To deselect the pair, click anywhere within the code block or select another pair.  
The selection effect can be disabled by adding the `no-brace-select` to the code block. This class can also be inherited.

## Rainbow braces 🌈

To enable rainbow braces, simply add the `rainbow-braces` class to a code block. This class can also get inherited.

</section>

<section class="match-braces language-none">

# Examples

## JavaScript

<pre data-src="./prism-match-braces.js"></pre>

```js
const func = (a, b) => {
	return `${a}:${b}`;
}
```

## Lisp

```lisp
(defun factorial (n)
	(if (= n 0) 1
		(* n (factorial (- n 1)))))
```

## Lisp with rainbow braces 🌈 but without hover

```lisp { .rainbow-braces .no-brace-hover }
(defun factorial (n)
	(if (= n 0) 1
		(* n (factorial (- n 1)))))
```

</section>
