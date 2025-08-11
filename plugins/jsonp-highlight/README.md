---
title: JSONP Highlight
description: Fetch content with JSONP and highlight some interesting content (e.g. GitHub/Gists or Bitbucket API).
owner: nauzilus
noCSS: true
resources: ./demo.js { defer }
---

<section class="language-markup">

# How to use

Use the `data-jsonp` attribute on `<pre>` elements, like so:

```html
<pre
	class="language-javascript"
	data-jsonp="https://api.github.com/repos/PrismJS/prism/contents/prism.js">
</pre>
```

Don't specify the `callback` query parameter in the URL; this will be added automatically. If the API expects a different callback parameter name however, use the `data-callback` parameter to specify the name:

```html
<pre class="…" data-jsonp="…" data-callback="cb"></pre>
```

The next trick is of course actually extracting something from the JSONP response worth highlighting, which means processing the response to extract the interesting data.

The following JSONP APIs are automatically detected and parsed:

- [GitHub](https://developer.github.com/v3/repos/contents/#get-contents)
- [GitHub Gists](https://developer.github.com/v3/gists/#get-a-single-gist)
- [Bitbucket](https://confluence.atlassian.com/display/BITBUCKET/src+Resources#srcResources-GETrawcontentofanindividualfile)

If you need to do your own parsing, you can hook your your own data adapters in two ways:

1. Supply the `data-adapter` parameter on the `<pre>` element. This must be the name of a globally defined function. The plugin will use _only_ this adapter to parse the response.
2. Register your adapter function by calling `Prism.plugins.jsonphighlight.registerAdapter(rsp => { … })`{ .language-javascript }. It will be added to the list of inbuilt adapters and used if no other registered adapter (e.g. GitHub/Bitbucket) can parse the response.

In either case, the function must accept at least a single parameter (the JSONP response) and returns a string of the content to highlight. If your adapter cannot parse the response, you must return `null`{ .language-javascript }. The DOM node that will contain the highlighted code will also be passed in as the second argument, incase you need to use it to query any extra information (maybe you wish to inspect the `class` or `data-jsonp` attributes to assist in parsing the response).

The following example demonstrates both methods of using a custom adapter, to simply return the stringified JSONP response (i.e highlight the entire JSONP data):

```html
<!-- perhaps this is in a .js file elsewhere -->
<script>
	function dump_json (rsp) {
		return "using dump_json: " + JSON.stringify(rsp, null, 2);
	}
</script>

<!-- … include prism.js … -->
<script>
	Prism.plugins.jsonphighlight.registerAdapter(rsp => {
		return "using registerAdapter: " + JSON.stringify(rsp, null, 2);
	})
</script>
```

And later in your HTML:

```html
<!-- using the data-adapter attribute -->
<pre class="language-javascript" data-jsonp="…" data-adapter="dump_json"></pre>

<!-- using whatever data adapters are available -->
<pre class="language-javascript" data-jsonp="…"></pre>
```

Finally, unlike like the [File Highlight](../file-highlight) plugin, you _do_ need to supply the appropriate `class` with the language to highlight. This could have been auto-detected, but since you're not actually linking to a file it's not always possible (see below in the example using GitHub status). Furthermore, if you're linking to files with a `.xaml` extension for example, this plugin then needs to somehow map that to highlight as `markup`, which just means more bloat. You know what you're trying to highlight, just say so. 🙂

## Caveat for Gists

There's a bit of a catch with gists, as they can actually contain multiple files. There are two options to handle this:

1. If your gist only contains one file, you don't need to to anything; the one and only file will automatically be chosen and highlighted
2. If your file contains multiple files, the first one will be chosen by default. However, you can supply the filename in the `data-filename` attribute, and this file will be highlighted instead:

```html
<pre class="…" data-jsonp="…" data-filename="mydemo.js"></pre>
```

</section>

<section>

# Examples

The plugin’s JS code (from GitHub):

<pre class="lang-javascript" data-jsonp="https://api.github.com/repos/PrismJS/prism/contents/plugins/jsonp-highlight/prism-jsonp-highlight.js"></pre>

GitHub Gist (gist contains a single file, automatically selected):

<pre class="lang-css" data-jsonp="https://api.github.com/gists/599a04c05a22f48a292d"></pre>

GitHub Gist (gist contains a multiple files, file to load specified):

<pre class="lang-markup" data-jsonp="https://api.github.com/gists/599a04c05a22f48a292d" data-filename="dabblet.html"></pre>

Bitbucket API:

<pre class="lang-css" data-jsonp="https://bitbucket.org/!api/1.0/repositories/nauzilus/stylish/src/master/whirlpool/style.css"></pre>

Custom adapter (JSON.stringify showing the GitHub REST API for [Prism's repository](https://api.github.com/repos/PrismJS/prism)):

<pre class="lang-javascript" data-jsonp="https://api.github.com/repos/PrismJS/prism" data-adapter="dump_json"></pre>

Registered adapter (as above, but without explicitly declaring the `data-adapter` attribute):

<pre class="lang-javascript" data-jsonp="https://api.github.com/repos/PrismJS/prism"></pre>

</section>
