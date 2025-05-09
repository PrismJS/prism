---
title: Toolbar
description: Attach a toolbar for plugins to easily register buttons on the top of a code block.
owner: mAAdhaTTah
body_classes: language-markup
resources: ./demo.js { defer }
---

<section data-toolbar-order="select-code,hello-world,label">

# How to use

The Toolbar plugin allows for several methods to register your button, using the `Prism.plugins.toolbar.registerButton` function.

The simplest method is through the HTML API. Add a `data-label` attribute to the `pre` element, and the Toolbar plugin will read the value of that attribute and append a label to the code snippet.

```html { data-label="Hello World!" }
<pre data-src="./prism-toolbar.js" data-label="Hello World!"></pre>
```

If you want to provide arbitrary HTML to the label, create a `template` element with the HTML you want in the label, and provide the `template` element's `id` to `data-label`. The Toolbar plugin will use the template's content for the button. You can also use to declare your event handlers inline:

```html { data-label="my-label-button" }
<pre data-src="./prism-toolbar.js" data-label="my-label-button"></pre>
```

```html
<template id="my-label-button"><button onclick="console.log('This is an inline-handler');">My button</button></template>
```

## Registering buttons

For more flexibility, the Toolbar exposes a JavaScript function that can be used to register new buttons or labels to the Toolbar, `Prism.plugins.toolbar.registerButton`.

The function accepts a key for the button and an object with a `text` property string and an optional `onClick` function or a `url` string. The `onClick` function will be called when the button is clicked, while the `url` property will be set to the anchor tag's `href`.

```js
Prism.plugins.toolbar.registerButton("hello-world", {
	text: "Hello World!", // required
	onClick: function (env) {
		// optional
		alert(`This code snippet is written in ${env.language}.`);
	},
});
```

See how the above code registers the `Hello World!` button? You can use this in your plugins to register your own buttons with the toolbar.

If you need more control, you can provide a function to `registerButton` that returns either a `span`, `a`, or `button` element.

```js
Prism.plugins.toolbar.registerButton("select-code", env => {
	let button = document.createElement("button");
	button.innerHTML = "Select Code";

	button.addEventListener("click", () => {
		// Source: http://stackoverflow.com/a/11128179/2757940
		if (document.body.createTextRange) {
			// ms
			let range = document.body.createTextRange();
			range.moveToElementText(env.element);
			range.select();
		}
		else if (window.getSelection) {
			// moz, opera, webkit
			let selection = window.getSelection();
			let range = document.createRange();
			range.selectNodeContents(env.element);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	});

	return button;
});
```

The above function creates the Select Code button you see, and when you click it, the code gets highlighted.

## Ordering buttons

By default, the buttons will be added to the code snippet in the order they were registered. If more control over the order is needed, the `data-toolbar-order` attribute can be used. Given a comma-separated list of button names, it will ensure that these buttons will be displayed in the given order.  
Buttons not listed will not be displayed. This means that buttons can be disabled using this technique.

Example: The "Hello World!" button will appear before the "Select Code" button and the custom label button will not be displayed.

```html { data-toolbar-order="hello-world,select-code" data-label="Hello World!" }
<pre data-toolbar-order="hello-world,select-code" data-label="Hello World!"><code></code></pre>
```

The `data-toolbar-order` attribute is inherited, so you can define the button order for the whole document by adding the attribute to the `body` of the page.

```html
<body data-toolbar-order="select-code,hello-world,label">
```

</section>

<template id="my-label-button"><button onclick="console.log('This is an inline-handler');">My button</button></template>
