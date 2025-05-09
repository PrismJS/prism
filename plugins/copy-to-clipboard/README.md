---
title: Copy to Clipboard
description: Add a button that copies the code block to the clipboard when clicked.
owner: mAAdhaTTah
require: toolbar
noCSS: true
body_classes: language-text
resources:
  - ../autoloader/prism-autoloader.js
  - ../toolbar/prism-toolbar.css
  - ../toolbar/prism-toolbar.js
---

<section>

# How to use

The plugin depends on the Prism [Toolbar](../toolbar) plugin. In addition to including the plugin file with your PrismJS build, ensure it is loaded before the plugin.

</section>

<section>

# Settings

By default, the plugin shows messages in English and sets a 5-second timeout after a click. You can use the following HTML5 data attributes to override the default settings:

- `data-prismjs-copy`{ .token .attr-name } — default message displayed by Copy to Clipboard;
- `data-prismjs-copy-error`{ .token .attr-name } — a message displayed after failing copying, prompting the user to press <kbd>Ctrl</kbd>+<kbd>C</kbd>;
- `data-prismjs-copy-success`{ .token .attr-name } — a message displayed after a successful copying;
- `data-prismjs-copy-timeout`{ .token .attr-name } — a timeout (in milliseconds) after copying. Once the timeout passed, the success or error message will revert back to the default message. The value should be a non-negative integer.

The plugin traverses up the DOM tree to find each of these attributes. The search starts at every `pre code`{ .token .tag } element and stops at the closest ancestor element that has a desired attribute or at the worst case, at the `html`{ .token .tag } element.

**Warning!** Although possible, you definitely shouldn't add these attributes to the `html`{ .token .tag } element, because a human-readable text should be placed _after_ the character encoding declaration (`<meta charset="...">`), and the latter [must be](https://html.spec.whatwg.org/multipage/semantics.html#charset) serialized completely within the first 512 (in older browsers) or 1024 bytes of the document. Consider using the `body`{ .token .tag } element or one of its descendants.

</section>

<section>

# Styling

This plugin supports customizing the style of the copy button. To understand how this is done, let's look at the HTML structure of the copy button:

```html
<button class="copy-to-clipboard-button" type="button" data-copy-state="copy">
	<span>Copy</span>
</button>
```

The `copy-to-clipboard-button` class can be used to select the button. The `data-copy-state` attribute indicates the current state of the plugin with the 3 possible states being:

- `data-copy-state="copy"` — default state;
- `data-copy-state="copy-error"` — the state after failing copying;
- `data-copy-state="copy-success"` — the state after successful copying;

These 3 states should be conveyed to the user either by different styling or displaying the button text.

</section>

<section>

# Examples

## Sharing

The following code blocks show modified messages and both use a half-second timeout. The other settings are set to default.

Source code:

```html
<body data-prismjs-copy-timeout="500">
	<pre><code class="language-js" data-prismjs-copy="Copy the JavaScript snippet!">console.log('Hello, world!');</code></pre>

	<pre><code class="language-c" data-prismjs-copy="Copy the C snippet!">int main() {
	return 0;
}</code></pre>
</body>
```

Output:

<div data-prismjs-copy-timeout="500">

```js { data-prismjs-copy="Copy the JavaScript snippet!" }
console.log('Hello, world!');
```

```c { data-prismjs-copy="Copy the C snippet!" }
int main() {
	return 0;
}
```

</div>

## Inheritance

The plugin always use the closest ancestor element that has a desired attribute, so it's possible to override any setting on any descendant. In the following example, the `baz`{ .token .attr-value } message is used. The other settings are set to default.

Source code:

```html
<body data-prismjs-copy="foo">
	<main data-prismjs-copy="bar">
		<pre><code class="language-c" data-prismjs-copy="baz">int main() {
	return 0;
}</code></pre>
	</main>
</body>
```

Output:

<div data-prismjs-copy="foo">
	<div data-prismjs-copy="bar">

```c { data-prismjs-copy="baz" }
int main() {
	return 0;
}
```

	</div>
</div>

## i18n

You can use the data attributes for internationalization.

The following code blocks use shared messages in Russian and the default 5-second timeout.

Source code:

```html
<!DOCTYPE html>
<html lang="ru">
<!-- The head is omitted. -->
<body
	data-prismjs-copy="Скопировать"
	data-prismjs-copy-error="Нажмите Ctrl+C, чтобы скопировать"
	data-prismjs-copy-success="Скопировано!"
>
	<pre><code class="language-c">int main() {
	return 0;
}</code></pre>

	<pre><code class="language-js">console.log('Hello, world!');</code></pre>
</body>
</html>
```

Output:

<div
	data-prismjs-copy="Скопировать"
	data-prismjs-copy-error="Нажмите Ctrl+C, чтобы скопировать"
	data-prismjs-copy-success="Скопировано!"
>

```c
int main() {
	return 0;
}
```

```js
console.log('Hello, world!');
```

</div>

The next HTML document is in English, but some code blocks show messages in Russian and simplified Mainland Chinese. The other settings are set to default.

Source code:

```html
<!DOCTYPE html>
<html lang="en"><!-- The head is omitted. -->
<body>
	<pre><code class="language-js">console.log('Hello, world!');</code></pre>

	<pre
		lang="ru"
		data-prismjs-copy="Скопировать"
		data-prismjs-copy-error="Нажмите Ctrl+C, чтобы скопировать"
		data-prismjs-copy-success="Скопировано!"
	><code class="language-js">console.log('Привет, мир!');</code></pre>

	<pre
		lang="zh-Hans-CN"
		data-prismjs-copy="复制文本"
		data-prismjs-copy-error="按Ctrl+C复制"
		data-prismjs-copy-success="文本已复制！"
	><code class="language-js">console.log('你好，世界！');</code></pre>
</body>
</html>
```

Output:

```js
console.log('Hello, world!');
```

```js { lang="ru" data-prismjs-copy="Скопировать" data-prismjs-copy-error="Нажмите Ctrl+C, чтобы скопировать" data-prismjs-copy-success="Скопировано!" }
console.log('Привет, мир!');
```

```js { lang="zh-Hans-CN" data-prismjs-copy="复制文本" data-prismjs-copy-error="按Ctrl+C复制" data-prismjs-copy-success="文本已复制！" }
console.log('你好，世界！');
```

</section>
