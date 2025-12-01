# Code Folding Plugin

This plugin adds support for collapsing and expanding large code blocks to improve readability when viewing documentation, tutorials, or code reviews with multiple code examples.

## Features

- Automatically adds collapse and expand buttons to code blocks
- Supports optional auto-folding for very large code blocks
- Configurable through data attributes
- Works alongside other Prism plugins like line numbers and toolbar
- Smooth transitions and accessible keyboard controls

## Usage

### Basic Usage

Add the `code-folding` class to your `pre` or `code` element:

```html
<pre class="language-javascript code-folding"><code>
// Your large code block here
function example() {
    // Many lines of code...
}
</code></pre>
```

### Auto-Folding

By default, code blocks with more than 50 lines will be automatically folded. You can customize this behavior:

```html
<!-- Always fold this code block -->
<pre class="language-python code-folding" data-fold="true"><code>
# Your code here
</code></pre>

<!-- Never auto-fold this code block -->
<pre class="language-java code-folding" data-fold="false"><code>
// Your code here
</code></pre>

<!-- Auto-fold only if more than 30 lines -->
<pre class="language-css code-folding" data-fold-threshold="30"><code>
/* Your code here */
</code></pre>
```

## Configuration

The plugin supports the following data attributes:

- `data-fold`: Set to `"true"` to always fold initially, or `"false"` to never auto-fold
- `data-fold-threshold`: Set the minimum number of lines required for auto-folding (default: 50)

## API

The plugin exposes a `CodeFolding` instance on `Prism.plugins.codeFolding` with the following methods:

### `fold(element)`

Folds the code block associated with the given element.

```javascript
const pre = document.querySelector('pre.code-folding');
Prism.plugins.codeFolding.fold(pre);
```

### `unfold(element)`

Unfolds the code block associated with the given element.

```javascript
const pre = document.querySelector('pre.code-folding');
Prism.plugins.codeFolding.unfold(pre);
```

### `toggle(element)`

Toggles the folded state of the code block.

```javascript
const pre = document.querySelector('pre.code-folding');
Prism.plugins.codeFolding.toggle(pre);
```

## Compatibility

This plugin works well with other Prism plugins:

- **Line Numbers**: The folding button appears in the correct position
- **Toolbar**: The folding button is positioned to avoid conflicts
- **Copy to Clipboard**: Works with both folded and unfolded states

## Minimum Requirements

- Code blocks must have at least 10 lines to show the folding button
- Works in all modern browsers with ES6 support

## Customization

You can customize the appearance by overriding the CSS variables or classes:

```css
/* Change button appearance */
pre.code-folding > .code-folding-toggle {
    background: #your-color;
    color: #your-text-color;
}

/* Adjust folded height */
pre.code-folded > code {
    max-height: 10em; /* Show more or fewer lines */
}
```

## Notes

- The plugin respects user preferences and accessibility standards
- Folded code blocks show a gradient fade effect to indicate hidden content
- Keyboard navigation is fully supported with focus indicators
