---
title: Inline Color
description: Adds a small inline preview for colors in style sheets.
owner: RunDevelopment
require: css-extras
resources: components/prism-css-extras.js
---

<section>

# Examples

## CSS

```css
span.foo {
	background-color: navy;
	color: #BFD;
}

span.bar {
	background: rgba(105, 0, 12, .38);
	color: hsl(30, 100%, 50%);
	border-color: transparent;
}
```

<pre data-src="https://dev.prismjs.com/themes/prism.css"></pre>

## HTML (Markup)

```html
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="utf-8" />
<title>Example</title>
<style>
	/* Also works here */
	a.not-a-class {
		color: red;
	}
</style>
<body style="color: black">

</body>
</html>
```

</section>
