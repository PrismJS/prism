---
title: Autoloader
description: Automatically loads the needed languages to highlight the code blocks.
owner: Golmote
noCSS: true
resources:
  - /components.js
  - https://prismjs.com/assets/vendor/jszip.min.js
  - https://prismjs.com/assets/vendor/FileSaver.min.js
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
Alternatively, you can also clone the GitHub repo and take the `components` folder from there. Read our [usage section](https://prismjs.com/index.html#basic-usage-cdn) to use a CDN.

You can then download Prism core and any plugins from the [Download](https://prismjs.com/download.html) page, without checking any languages (or just check the languages you want to load by default, e.g. if you're using a language a lot, then you probably want to save the extra HTTP request).

A couple of additional options are available through the configuration object `Prism.plugins.autoloader`.

## Specifying the grammars path

By default, the plugin will look for the missing grammars in the `components` folder. If your files are in a different location, you can specify it using the `languages_path` option:

```
Prism.plugins.autoloader.languages_path = 'path/to/grammars/';
```

_Note:_ Autoloader is pretty good at guessing this path. You most likely won't have to change this path.

## Using development versions

By default, the plugin uses the minified versions of the grammars. If you wish to use the development versions instead, you can set the `use_minified` option to false:

```
Prism.plugins.autoloader.use_minified = false;
```

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

## Force to reload a grammar

The plugin usually doesn't reload a grammar if it already exists. In some very specific cases, you might however want to do so. If you add an exclamation mark after an alias in the `data-dependencies` attribute, this language will be reloaded.

```html
<pre class="language-markup" data-dependencies="markup,css!"><code>
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

<script>
	async function getZip (files, elt) {
		let process = async () => {
			elt.setAttribute('data-progress', Math.round((i / l) * 100));
			if (i < l) {
				await addFile(zip, files[i][0], files[i][1]);
				i++;
				await process();
			}
		};

		let zip = new JSZip();
		let l = files.length;
		let i = 0;

		await process();

		return zip;
	}

	async function addFile (zip, filename, filepath) {
		let contents = await getFileContents(filepath);
		zip.file(filename, contents);
	}

	async function getFileContents (filepath) {
		let response = await fetch(filepath);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return response.text();
	}

	addEventListener("DOMContentLoaded", async () => {
		let components = await (await fetch('/components.json')).json();

		document.querySelector('.download-grammars').addEventListener('click', async ({ target }) => {
			let btn = target;
			if (btn.classList.contains('loading')) {
				return;
			}
			btn.classList.add('loading');
			btn.setAttribute('data-progress', 0);

			let files = [];
			for (let id in components.languages) {
				if (id === 'meta') {
					continue;
				}
				let basepath = components.languages.meta.path.replace(/\{id}/g, id);
				let basename = basepath.substring(basepath.lastIndexOf('/') + 1);
				files.push([basename + '.js', basepath + '.js']);
				files.push([basename + '.min.js', basepath + '.min.js']);
			}

			let zip = await getZip(files, btn);
			btn.classList.remove('loading');

			let blob = await zip.generateAsync({ type: 'blob' });
			saveAs(blob, 'prism-components.zip');
		});
	});
</script>
