---
title: Autolinker
description: Converts URLs and emails in code to clickable links. Parses Markdown links in comments.
owner: LeaVerou
---

<section>

# How to use

URLs and emails will be linked automatically, you don’t need to do anything. To link some text inside a comment to a certain URL, you may use the Markdown syntax:

```markdown
[Text you want to see](https://url-goes-here.com)
```
</section>

<section>

# Examples

## JavaScript

```js
/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license https://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou https://lea.verou.me
 * Reach Lea at fake@email.com (no, not really)
 * And this is [a Markdown link](https://prismjs.com). Sweet, huh?
 */
let foo = 5;
// And a single line comment https://google.com
```

## CSS

```css
@font-face {
	src: url(https://lea.verou.me/logo.otf);
	font-family: 'LeaVerou';
}
```

## HTML

```html
<!-- Links in HTML, woo!
Lea Verou https://lea.verou.me or, with Markdown, [Lea Verou](https://lea.verou.me) -->
<img src="https://prismjs.com/assets/img/spectrum.png" alt="In attributes too!" />
<p>Autolinking in raw text: https://prismjs.com</p>
```
</section>
