---
title: Previewers
description: Previewers for angles, colors, gradients, easing and time.
owner: Golmote
require: css-extras
resources:
  - components/prism-css-extras.js
  - components/prism-less.js
  - components/prism-sass.js
  - components/prism-scss.js
  - components/prism-stylus.js
---

<section class="language-markup">

# How to use

You don't need to do anything. With this plugin loaded, a previewer will appear on hovering some values in code blocks. The following previewers are supported:

- `angle` for angles
- `color` for colors
- `gradient` for gradients
- `easing` for easing functions
- `time` for durations

This plugin is compatible with CSS, Less, Markup attributes, Sass, Scss and Stylus.

</section>

<section>

# Examples

## CSS

```css
.example-gradient {
	background: -webkit-linear-gradient(left,     #cb60b3 0%, #c146a1 50%, #a80077 51%, #db36a4 100%); /* Chrome10+, Safari5.1+ */
	background:    -moz-linear-gradient(left,     #cb60b3 0%, #c146a1 50%, #a80077 51%, #db36a4 100%); /* FF3.6+ */
	background:     -ms-linear-gradient(left,     #cb60b3 0%, #c146a1 50%, #a80077 51%, #db36a4 100%); /* IE10+ */
	background:      -o-linear-gradient(left,     #cb60b3 0%, #c146a1 50%, #a80077 51%, #db36a4 100%); /* Opera 11.10+ */
	background:         linear-gradient(to right, #cb60b3 0%, #c146a1 50%, #a80077 51%, #db36a4 100%); /* W3C */
}
.example-angle {
	transform: rotate(10deg);
}
.example-color {
	color: rgba(255, 0, 0, 0.2);
	background: purple;
	border: 1px solid hsl(100, 70%, 40%);
}
.example-easing {
	transition-timing-function: linear;
}
.example-time {
	transition-duration: 3s;
}
```

## Markup attributes

```html
<table bgcolor="#6E5494">
<tr style="background: lightblue;">
```

## Less

```less
@gradient: linear-gradient(135deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%);
.example-gradient {
	background: -webkit-linear-gradient(-45deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%); /* Chrome10+, Safari5.1+ */
	background:    -moz-linear-gradient(-45deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%); /* FF3.6+ */
	background:     -ms-linear-gradient(-45deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%); /* IE10+ */
	background:      -o-linear-gradient(-45deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%); /* Opera 11.10+ */
	background:         linear-gradient(135deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%); /* W3C */
}
@angle: 3rad;
.example-angle {
	transform: rotate(.4turn)
}
@nice-blue: #5B83AD;
.example-color {
	color: hsla(102, 53%, 42%, 0.4);
}
@easing: cubic-bezier(0.1, 0.3, 1, .4);
.example-easing {
	transition-timing-function: ease;
}
@time: 1s;
.example-time {
	transition-duration: 2s;
}
```

## Sass

```sass
$gradient: linear-gradient(135deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%)
@mixin example-gradient
	background: -moz-radial-gradient(center, ellipse cover, #f2f6f8 0%, #d8e1e7 50%, #b5c6d0 51%, #e0eff9 100%)
	background: radial-gradient(ellipse at center, #f2f6f8 0%, #d8e1e7 50%, #b5c6d0 51%, #e0eff9 100%)
$angle: 380grad
@mixin example-angle
	transform: rotate(-120deg)
.example-angle
	transform: rotate(18rad)
$color: blue
@mixin example-color
	color: rgba(147, 32, 34, 0.8)
.example-color
	color: pink
$easing: ease-out
.example-easing
	transition-timing-function: ease-in-out
$time: 3s
@mixin example-time
	transition-duration: 800ms
.example-time
	transition-duration: 0.8s
```

## Scss

```scss
$gradient: linear-gradient(135deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%);
$attr: background;
.example-gradient {
	#{$attr}-image: repeating-linear-gradient(10deg, rgba(255, 0, 0, 0), rgba(255, 0, 0, 1) 10px, rgba(255, 0, 0, 0) 20px);
}
$angle: 1.8turn;
.example-angle {
	transform: rotate(-3rad)
}
$color: blue;
.example-color {
	#{$attr}-color: rgba(255, 255, 0, 0.75);
}
$easing: linear;
.example-easing {
	transition-timing-function: cubic-bezier(0.9, 0.1, .2, .4);
}
$time: 1s;
.example-time {
	transition-duration: 10s
}
```

## Stylus

```stylus
gradient = linear-gradient(135deg, #9dd53a 0%, #a1d54f 50%, #80c217 51%, #7cbc0a 100%)
.example-gradient
	background-image: repeating-radial-gradient(circle, rgba(255, 0, 0, 0), rgba(255, 0, 0, 1) 10px, rgba(255, 0, 0, 0) 20px)
angle = 357deg
.example-angle
	transform: rotate(100grad)
color = olive
.example-color
	color: #000
easing = ease-in
.example-easing
	transition-timing-function: ease-out
time = 3s
.example-time
	transition-duration: 0.5s
```

</section>

<section>

# Disabling a previewer

All previewers are enabled by default. To enable only a subset of them, a `data-previewers` attribute can be added on a code block or any ancestor. Its value should be a space-separated list of previewers representing the subset.

For example:

```html
<pre class="language-css" data-previewers="color time"><code>div {
	/* Only the previewer for color and time are enabled */
	color: red;
	transition-duration: 1s;
	/* The previewer for angles is not enabled. */
	transform: rotate(10deg);
}</code></pre>
```

will give the following result:

```css { data-previewers="color time" }
div {
	/* Only the previewers for color and time are enabled */
	color: red;
	transition-duration: 1s;
	/* The previewer for angles is not enabled. */
	transform: rotate(10deg);
}
```

</section>

<section class="language-javascript">

# API

This plugins provides a constructor that can be accessed through `Prism.plugins.Previewer`.

Once a previewer has been instantiated, an HTML element is appended to the document body. This element will appear when specific tokens are hovered.

## `new Prism.plugins.Previewer(type, updater, supportedLanguages)`

- `type`: the token type this previewer is associated to. The previewer will be shown when hovering tokens of this type.

- `updater`: the function that will be called each time an associated token is hovered. This function takes the text content of the token as its only parameter. The previewer HTML element can be accessed through the keyword `this`. This function must return `true` for the previewer to be shown.

- `supportedLanguages`: an optional array of supported languages. The previewer will be available only for those. Defaults to `'*'`, which means every languages.

- `initializer`: an optional function. This function will be called when the previewer is initialized, right after the HTML element has been appended to the document body.

</section>
