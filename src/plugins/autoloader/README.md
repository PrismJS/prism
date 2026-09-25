---
title: Autoloader
description: Automatically loads the needed languages to highlight the code blocks.
owner: Golmote
noCSS: true
resources:
  - https://prismjs.com/assets/vendor/jszip.min.js
  - https://prismjs.com/assets/vendor/FileSaver.min.js
  - /languages/css.js
  - ./demo.js
---

<style>
	.download-grammars {
		font: inherit;
		border: 0;
		padding: 0;
		margin: 0;
		background: none;
		text-decoration: underline;
		cursor: pointer;

		&.loading:after {
			content: " [Generating... " attr(data-progress) "%]";
		}
	}
</style>

<section class="language-javascript">

# How to use

The plugin will automatically handle missing grammars and load them for you. To do this, you need to provide a URL to a directory of all the grammars you want. This can be the path to a local directory with all grammars or a CDN URL.

You can download all the available grammars by clicking on the following link: <button class="download-grammars" type="button">download all grammars</button>.<br />
Alternatively, you can also install the `prismjs` package and take the `dist` folder from there. Read our [usage section](/start/#basic-usage-cdn) to use a CDN.

You can then download Prism core and any plugins from the [Download](/download/) page, without checking any languages (or just check the languages you want to load by default, e.g. if you're using a language a lot, then you probably want to save the extra HTTP request).

An additional option is available through the configuration object `Prism.pluginRegistry.peek('autoloader').plugin`.

## Specifying the grammars path

By default, the plugin will look for the missing grammars in the `languages` folder. If your files are in a different location, you can specify the folder that contains `languages`, as an absolute URL, using the `srcPath` option:

```
Prism.pluginRegistry.peek('autoloader').plugin.srcPath = 'https://example.com/path/to/grammars/';
```

_Note:_ Autoloader is pretty good at guessing this path. You most likely won't have to change this path.

## Compound language ids

Compound ids of meta-languages such as `language-diff:css` or `language-django:css` are understood: the plugin loads every part (`diff` and `css`).

## Specifying additional dependencies

All default dependencies are already included in the plugin. However, there are some cases where you might want to load an additional dependency for a specific code block. To do so, just add a `data-dependencies` attribute on you `<code>` or `<pre>` tags, containing a list of comma-separated language aliases.

```markup
<pre><code class="language-pug" data-dependencies="less">
:less
	foo {
		color: @red;
	}
</code><pre>
```

</section>

<section>

# Examples

Note that no languages are loaded on this page by default.

Basic usage with some Perl code:

```perl
my ($class, $filename) = @_;
```

Alias support with TypeScript's `ts`:

```ts
const a: number = 0;
```

The Less filter used in Pug:

```pug
:less
	foo {
		color: @red;
	}
```

# Markdown

Markdown will use the Autoloader to automatically load missing languages.

````markdown
The C# code will be highlighted __after__ the rest of this document.

```csharp
public class Foo : IBar<int> {
	public string Baz { get; set; } = "foo";
}
```

The CSS code will be highlighted with this document because CSS has already been loaded.

```css
a:hover {
	color: green !important;
}
```
````

</section>
