---
title: Filter highlightAll
description: Filters the elements the `highlightAll` and `highlightAllUnder` methods actually highlight.
owner: RunDevelopment
noCSS: true
resources:
  - components/prism-typescript.js
  - ./demo.js { defer }
---

<style>
	dt { font-size: 100%; }
</style>

<section class="language-typescript">

# How to use

Filter highlightAll provides you with ways to filter the element the `highlightAll` and `highlightAllUnder` methods actually highlight. This can be very useful when you use Prism's automatic highlighting when loading the page but want to exclude certain code blocks.

</section>

<section class="language-typescript">

# API

In `Prism.plugins.filterHighlightAll` you can find the following:

`add(condition: (value: { element, language: string }) => boolean): void`

: Adds a new filter which will only allow an element to be highlighted if the given function returns `true` for that element.  
This can be used to define a custom language filter.

`addSelector(selector: string): void`

: Adds a new filter which will only allow an element to be highlighted if the element matches the given CSS selector.

`reject.add(condition: (value: { element, language: string }) => boolean): void`

: Same as `add`, but only elements which do **not** fulfill the condition will be highlighted.

`reject.addSelector(selector: string): void`

: Same as `addSelector`, but only elements which do **not** match the selector will be highlighted.

`filterKnown: boolean = false`

: Set this to `true` to only allow known languages. Code blocks without a set language or an unknown language will not be highlighted.

An element will only be highlighted by the `highlightAll` and `highlightAllUnder` methods if all of the above accept the element.

## Attributes

You can also add the following `data-*`{ .language-none } attributes to the script which contains the Filter highlightAll plugin.

`<script src="..." data-filter-selector="<css selector>">`{ .language-markup }

: This attribute is a shorthand for `Prism.plugins.filterHighlightAll.addSelector`. The value of the attribute will be passed as is to the `addSelector` function.

`<script src="..." data-reject-selector="<css selector>">`{ .language-markup }

: This attribute is a shorthand for `Prism.plugins.filterHighlightAll.reject.addSelector`. The value of the attribute will be passed as is to the `rejectSelector` function.

`<script src="..." data-filter-known>`{ .language-markup }

: This attribute can be used to set the value of `Prism.plugins.filterHighlightAll.filterKnown`. `filterKnown` will be set to `true` if the attribute is present, `false` otherwise.

</section>

<section>

# Examples

The following code is used to define a filter on this page.

```js
// <code> elements with a .no-highlight class will be ignored
Prism.plugins.filterHighlightAll.reject.addSelector('code.no-highlight');
Prism.plugins.filterHighlightAll.reject.addSelector('pre.no-highlight > code');

// don't highlight CSS code
Prism.plugins.filterHighlightAll.add(function (env) {
	return env.language !== 'css';
});
```

The results:

```js { .language-javascript .no-highlight }
let foo = "I'm not being highlighted";
```

```css { .language-css }
a.link::after {
	content: 'also not being highlighted';
	color: #F00;
}
```

Prism will ignore these blocks, so you can even define your own static highlighting which Prism would normally remove.

<pre class="language-css"><code class="language-css">a.link::before {
	cont<span class="token selector">ent: 'I just do my o</span>wn highlighting';
	color: <span class="token constant">#F00</span>;
}</code></pre>

</section>
